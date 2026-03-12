// ============================================================
// Text Chunker — Recursive Character Text Splitter
// Splits documents into overlapping chunks for embedding
// ============================================================

const MAX_CHUNK_TOKENS = 512; // ~2048 chars
const OVERLAP_TOKENS = 50;    // ~200 chars
const CHARS_PER_TOKEN = 4;    // heuristic: 1 token ≈ 4 chars (English)

function estimateTokens(text: string): number {
  return Math.ceil(text.length / CHARS_PER_TOKEN);
}

function splitBySentences(text: string, maxTokens: number): string[] {
  const sentences = text.split(/(?<=[.!?])\s+/);
  const chunks: string[] = [];
  let current = '';

  for (const sentence of sentences) {
    const candidate = current ? `${current} ${sentence}` : sentence;
    if (estimateTokens(candidate) <= maxTokens) {
      current = candidate;
    } else {
      if (current) chunks.push(current);
      // If a single sentence is too long, split by words
      if (estimateTokens(sentence) > maxTokens) {
        const words = sentence.split(' ');
        let wordChunk = '';
        for (const word of words) {
          const next = wordChunk ? `${wordChunk} ${word}` : word;
          if (estimateTokens(next) <= maxTokens) {
            wordChunk = next;
          } else {
            if (wordChunk) chunks.push(wordChunk);
            wordChunk = word;
          }
        }
        current = wordChunk;
      } else {
        current = sentence;
      }
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

function applyOverlap(chunks: string[], overlapTokens: number): string[] {
  if (chunks.length <= 1) return chunks;
  const overlapChars = overlapTokens * CHARS_PER_TOKEN;

  return chunks.map((chunk, i) => {
    if (i === 0) return chunk;
    const prev = chunks[i - 1];
    const tail = prev.slice(-overlapChars);
    return `${tail} ${chunk}`.trim();
  });
}

/**
 * Splits a document into overlapping chunks suitable for embedding.
 *
 * Strategy (recursive fallback):
 * 1. Split on paragraph breaks (\n\n)
 * 2. If paragraph > maxTokens → split on sentence boundaries
 * 3. If sentence > maxTokens → split on word boundaries
 * 4. Apply overlap between consecutive chunks
 */
export function chunkText(
  text: string,
  maxTokens = MAX_CHUNK_TOKENS,
  overlapTokens = OVERLAP_TOKENS
): string[] {
  const paragraphs = text.split(/\n\n+/).filter((p) => p.trim().length > 0);
  const rawChunks: string[] = [];
  let current = '';

  for (const paragraph of paragraphs) {
    const candidate = current ? `${current}\n\n${paragraph}` : paragraph;

    if (estimateTokens(candidate) <= maxTokens) {
      current = candidate;
    } else {
      if (current) rawChunks.push(current);
      if (estimateTokens(paragraph) > maxTokens) {
        const sentenceChunks = splitBySentences(paragraph, maxTokens);
        // push all but the last, carry last as current
        rawChunks.push(...sentenceChunks.slice(0, -1));
        current = sentenceChunks.at(-1) ?? '';
      } else {
        current = paragraph;
      }
    }
  }
  if (current.trim()) rawChunks.push(current);

  return applyOverlap(rawChunks, overlapTokens);
}

export function estimateChunkTokens(text: string): number {
  return estimateTokens(text);
}
