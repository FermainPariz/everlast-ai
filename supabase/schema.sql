-- ============================================================
-- Everlast AI RAG System — Supabase Schema
-- Run this in the Supabase SQL Editor before starting the app
-- ============================================================

-- Enable pgvector extension for vector similarity search
create extension if not exists vector;

-- ============================================================
-- WORKSPACES (multi-tenant support)
-- Each workspace is an isolated knowledge base
-- ============================================================
create table if not exists workspaces (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  created_at  timestamptz not null default now()
);

-- Seed default workspaces so the app works out of the box
insert into workspaces (slug, name)
values
  ('default', 'Everlast AI (Default)'),
  ('demo', 'Demo Workspace'),
  ('ki', 'KI Wissensbasis')
on conflict (slug) do nothing;

-- ============================================================
-- DOCUMENTS (parent records — one per ingested document)
-- ============================================================
create table if not exists documents (
  id            uuid primary key default gen_random_uuid(),
  workspace_id  uuid not null references workspaces(id) on delete cascade,
  title         text not null,
  source_url    text,
  metadata      jsonb not null default '{}',
  created_at    timestamptz not null default now()
);

create index if not exists documents_workspace_id_idx on documents(workspace_id);

-- ============================================================
-- CHUNKS (retrievable text units with vector embeddings)
-- Each document is split into overlapping chunks
-- ============================================================
create table if not exists chunks (
  id            uuid primary key default gen_random_uuid(),
  document_id   uuid not null references documents(id) on delete cascade,
  workspace_id  uuid not null references workspaces(id) on delete cascade,
  content       text not null,
  chunk_index   integer not null,
  token_count   integer,
  embedding     vector(1536),   -- OpenAI text-embedding-3-small dimensions
  created_at    timestamptz not null default now()
);

create index if not exists chunks_document_id_idx on chunks(document_id);
create index if not exists chunks_workspace_id_idx on chunks(workspace_id);

-- IVFFlat index for approximate nearest neighbor search
-- Note: effective after ~1000+ rows; rebuild with REINDEX after bulk inserts
create index if not exists chunks_embedding_idx
  on chunks using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- ============================================================
-- SIMILARITY SEARCH FUNCTION
-- Returns chunks ranked by cosine similarity to query vector
-- workspace_slug provides tenant isolation
-- ============================================================
create or replace function match_chunks(
  query_embedding  vector(1536),
  workspace_slug   text,
  match_count      int    default 5,
  match_threshold  float  default 0.5
)
returns table (
  id           uuid,
  document_id  uuid,
  content      text,
  chunk_index  integer,
  similarity   float,
  doc_title    text
)
language plpgsql
as $$
begin
  return query
  select
    c.id,
    c.document_id,
    c.content,
    c.chunk_index,
    (1 - (c.embedding <=> query_embedding))::float as similarity,
    d.title as doc_title
  from chunks c
  join documents d on d.id = c.document_id
  join workspaces w on w.id = c.workspace_id
  where w.slug = workspace_slug
    and c.embedding is not null
    and (1 - (c.embedding <=> query_embedding)) > match_threshold
  order by c.embedding <=> query_embedding
  limit match_count;
end;
$$;
