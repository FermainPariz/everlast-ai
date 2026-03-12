import { createServerClient } from '@/lib/supabase/server';
import type { RetrievedChunk } from '@/types';

const DEFAULT_TOP_K = 5;
const DEFAULT_THRESHOLD = 0.3;

/**
 * Finds the most semantically similar chunks to a query embedding.
 * Uses Supabase's pgvector cosine similarity via the match_chunks RPC function.
 * Results are filtered by workspace_slug for tenant isolation.
 */
export async function retrieveChunks(
  queryEmbedding: number[],
  workspaceSlug: string,
  topK = DEFAULT_TOP_K,
  threshold = DEFAULT_THRESHOLD
): Promise<RetrievedChunk[]> {
  const supabase = createServerClient();

  const { data, error } = await supabase.rpc('match_chunks', {
    query_embedding: queryEmbedding,
    workspace_slug: workspaceSlug,
    match_count: topK,
    match_threshold: threshold,
  });

  if (error) {
    console.error('Retrieval error:', error);
    throw new Error(`Failed to retrieve chunks: ${error.message}`);
  }

  return (data ?? []) as RetrievedChunk[];
}

/**
 * Formats retrieved chunks into a context string for the LLM prompt.
 * Includes source attribution and caps total length.
 */
export function formatContext(chunks: RetrievedChunk[], maxChars = 6000): string {
  const sections = chunks.map(
    (chunk, i) =>
      `[Source ${i + 1}: ${chunk.doc_title}]\n${chunk.content}`
  );

  let context = sections.join('\n\n---\n\n');
  if (context.length > maxChars) {
    context = context.slice(0, maxChars) + '\n\n[Context truncated]';
  }
  return context;
}
