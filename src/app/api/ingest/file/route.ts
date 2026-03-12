import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { chunkText, estimateChunkTokens } from '@/lib/rag/chunker';
import { embedTexts } from '@/lib/rag/embedder';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

async function extractText(buffer: Buffer, filename: string): Promise<string> {
  const ext = filename.split('.').pop()?.toLowerCase();

  if (ext === 'txt' || ext === 'md') {
    return buffer.toString('utf-8');
  }

  if (ext === 'pdf') {
    const pdfParse = (await import('pdf-parse')).default;
    const result = await pdfParse(buffer);
    return result.text;
  }

  if (ext === 'docx') {
    const mammoth = await import('mammoth');
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  throw new Error(`Nicht unterstützter Dateityp: .${ext}`);
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const file = formData.get('file') as File | null;
    const title = (formData.get('title') as string | null)?.trim();
    const workspaceSlug = (formData.get('workspaceSlug') as string | null)?.trim() || 'default';
    const sourceUrl = (formData.get('sourceUrl') as string | null)?.trim() || null;

    if (!file) return NextResponse.json({ error: 'Keine Datei übermittelt' }, { status: 400 });
    if (!title) return NextResponse.json({ error: 'Titel fehlt' }, { status: 400 });
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Datei zu groß (max. 10 MB)' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const content = await extractText(buffer, file.name);

    if (!content.trim()) {
      return NextResponse.json({ error: 'Datei enthält keinen lesbaren Text' }, { status: 400 });
    }

    const supabase = createServerClient();

    const { data: workspace, error: wsError } = await supabase
      .from('workspaces')
      .select('id')
      .eq('slug', workspaceSlug)
      .single();

    if (wsError || !workspace) {
      return NextResponse.json({ error: `Workspace '${workspaceSlug}' nicht gefunden` }, { status: 404 });
    }

    const { data: document, error: docError } = await supabase
      .from('documents')
      .insert({ workspace_id: workspace.id, title, source_url: sourceUrl })
      .select('id')
      .single();

    if (docError || !document) {
      throw new Error(`Dokument-Insert fehlgeschlagen: ${docError?.message}`);
    }

    const chunks = chunkText(content);
    if (chunks.length === 0) {
      return NextResponse.json({ error: 'Dokument ergab keine Chunks' }, { status: 400 });
    }

    const embeddings = await embedTexts(chunks);

    const chunkRows = chunks.map((text, i) => ({
      document_id: document.id,
      workspace_id: workspace.id,
      content: text,
      chunk_index: i,
      token_count: estimateChunkTokens(text),
      embedding: embeddings[i],
    }));

    const { error: chunksError } = await supabase.from('chunks').insert(chunkRows);
    if (chunksError) {
      await supabase.from('documents').delete().eq('id', document.id);
      throw new Error(`Chunk-Insert fehlgeschlagen: ${chunksError.message}`);
    }

    const totalTokens = chunkRows.reduce((sum, c) => sum + (c.token_count ?? 0), 0);

    return NextResponse.json({
      documentId: document.id,
      chunksCreated: chunkRows.length,
      tokensProcessed: totalTokens,
    });
  } catch (error) {
    console.error('File ingest error:', error);
    const msg = error instanceof Error ? error.message : 'Interner Serverfehler';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
