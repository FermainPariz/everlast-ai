// ============================================================
// Shared TypeScript Types — Everlast AI RAG System
// ============================================================

export interface Workspace {
  id: string;
  slug: string;
  name: string;
  created_at: string;
}

export interface Document {
  id: string;
  workspace_id: string;
  title: string;
  source_url?: string;
  metadata: Record<string, unknown>;
  created_at: string;
  chunk_count?: number; // joined from chunks count query
}

export interface Chunk {
  id: string;
  document_id: string;
  workspace_id: string;
  content: string;
  chunk_index: number;
  token_count?: number;
  created_at: string;
  // embedding intentionally omitted — never sent to frontend
}

export interface RetrievedChunk {
  id: string;
  document_id: string;
  content: string;
  chunk_index: number;
  similarity: number;
  doc_title: string;
}

export interface QueryRequest {
  question: string;
  workspaceSlug: string;
}

export interface IngestRequest {
  title: string;
  content: string;
  workspaceSlug: string;
  sourceUrl?: string;
}

export interface IngestResponse {
  documentId: string;
  chunksCreated: number;
  tokensProcessed: number;
}

export interface SourceCitation {
  docTitle: string;
  content: string; // first 200 chars
  similarity: number;
}
