import OpenAI from 'openai';

const BATCH_SIZE = 100; // OpenAI allows up to 2048, use 100 for safety
const EMBEDDING_MODEL = 'text-embedding-3-small';

let openaiClient: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiClient;
}

/**
 * Generates embeddings for an array of texts using OpenAI.
 * Automatically batches requests to stay within API limits.
 * Returns a 1536-dimensional float array for each input text.
 */
export async function embedTexts(texts: string[]): Promise<number[][]> {
  const openai = getOpenAI();
  const embeddings: number[][] = [];

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);
    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: batch,
    });
    // Preserve order (OpenAI returns results in order)
    const batchEmbeddings = response.data
      .sort((a, b) => a.index - b.index)
      .map((d) => d.embedding);
    embeddings.push(...batchEmbeddings);
  }

  return embeddings;
}

/**
 * Convenience wrapper for embedding a single text.
 */
export async function embedText(text: string): Promise<number[]> {
  const [embedding] = await embedTexts([text]);
  return embedding;
}
