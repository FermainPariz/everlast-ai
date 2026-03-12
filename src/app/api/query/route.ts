import { NextRequest } from 'next/server';
import { z } from 'zod';
import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { embedText } from '@/lib/rag/embedder';
import { retrieveChunks, formatContext } from '@/lib/rag/retriever';
import { buildSystemPrompt } from '@/lib/rag/generator';
import type { SourceCitation } from '@/types';

const QuerySchema = z.object({
  question: z.string().min(1).max(2000),
  workspaceSlug: z.string().min(1).default('default'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, workspaceSlug } = QuerySchema.parse(body);

    // 1. Embed the user's question
    const queryEmbedding = await embedText(question);

    // 2. Retrieve semantically similar chunks from Supabase
    const chunks = await retrieveChunks(queryEmbedding, workspaceSlug);

    // 3. Build context string from retrieved chunks
    const context =
      chunks.length > 0
        ? formatContext(chunks)
        : 'No relevant documents found in the knowledge base.';

    // 4. Prepare source citations to attach as response header
    const sources: SourceCitation[] = chunks.map((chunk) => ({
      docTitle: chunk.doc_title,
      content: chunk.content.slice(0, 200),
      similarity: Math.round(chunk.similarity * 100) / 100,
    }));

    // 5. Stream the answer using Claude
    const result = streamText({
      model: anthropic('claude-haiku-4-5'),
      system: buildSystemPrompt(context),
      prompt: question,
      maxOutputTokens: 1024,
      temperature: 0.1,
    });

    // Attach sources in a custom response header for the frontend to parse
    const response = result.toTextStreamResponse();
    const headers = new Headers(response.headers);
    headers.set('x-sources', encodeURIComponent(JSON.stringify(sources)));
    headers.set('Content-Type', 'text/plain; charset=utf-8');

    return new Response(response.body, { headers });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ error: error.issues }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    console.error('Query error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
