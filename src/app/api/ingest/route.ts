import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerClient } from '@/lib/supabase/server';
import { chunkText, estimateChunkTokens } from '@/lib/rag/chunker';
import { embedTexts } from '@/lib/rag/embedder';

const IngestSchema = z.object({
  title: z.string().min(1).max(500),
  content: z.string().min(1).max(500000),
  workspaceSlug: z.string().min(1).default('default'),
  sourceUrl: z.string().url().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, workspaceSlug, sourceUrl } = IngestSchema.parse(body);

    const supabase = createServerClient();

    // 1. Resolve workspace id from slug
    const { data: workspace, error: wsError } = await supabase
      .from('workspaces')
      .select('id')
      .eq('slug', workspaceSlug)
      .single();

    if (wsError || !workspace) {
      return NextResponse.json(
        { error: `Workspace '${workspaceSlug}' not found` },
        { status: 404 }
      );
    }

    // 2. Insert the parent document record
    const { data: document, error: docError } = await supabase
      .from('documents')
      .insert({
        workspace_id: workspace.id,
        title,
        source_url: sourceUrl ?? null,
      })
      .select('id')
      .single();

    if (docError || !document) {
      throw new Error(`Failed to insert document: ${docError?.message}`);
    }

    // 3. Chunk the document text
    const chunkTexts = chunkText(content);

    if (chunkTexts.length === 0) {
      return NextResponse.json({ error: 'Document produced no chunks' }, { status: 400 });
    }

    // 4. Generate embeddings for all chunks (batched)
    const embeddings = await embedTexts(chunkTexts);

    // 5. Bulk insert chunks with embeddings
    const chunkRows = chunkTexts.map((text, i) => ({
      document_id: document.id,
      workspace_id: workspace.id,
      content: text,
      chunk_index: i,
      token_count: estimateChunkTokens(text),
      embedding: embeddings[i],
    }));

    const { error: chunksError } = await supabase.from('chunks').insert(chunkRows);

    if (chunksError) {
      // Clean up the document if chunk insertion fails
      await supabase.from('documents').delete().eq('id', document.id);
      throw new Error(`Failed to insert chunks: ${chunksError.message}`);
    }

    const totalTokens = chunkRows.reduce((sum, c) => sum + (c.token_count ?? 0), 0);

    return NextResponse.json({
      documentId: document.id,
      chunksCreated: chunkRows.length,
      tokensProcessed: totalTokens,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error('Ingest error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
