# CLAUDE.md — Everlast AI RAG System

> Projektspezifische Anweisungen für Claude Code in diesem Repository.

## Projekt-Kontext

**Was:** Recruiting Challenge für Everlast AI — RAG-System mit Next.js + Supabase.
**Ziel:** End-to-End Demo mit Chat-UI, Dokument-Ingestion und pgvector-Suche.
**Wissensbasis:** Fiktive Everlast AI Produktdokumentation + KI-Wissensartikel (3 Workspaces, ~53 Chunks gesamt).
**Detail-Erklärung:** Siehe [AUFGABE.md](./AUFGABE.md)

---

## Stack

| Bereich | Technologie |
|---|---|
| Framework | Next.js 14 (App Router, `src/` dir) |
| Datenbank | Supabase (Postgres + pgvector) |
| Embeddings | OpenAI `text-embedding-3-small` (1536 dims) |
| LLM | Anthropic `claude-haiku-4-5` |
| Streaming | Eigener `ReadableStream`-Reader (kein `useChat`) |
| Styling | Tailwind CSS + CSS-Variablen |
| Validation | Zod |
| Testing | Playwright MCP (`.mcp.json` im Root) |

---

## Sicherheitsregeln (WICHTIG)

- **`SUPABASE_SERVICE_ROLE_KEY`** darf NUR in Server-seitigen API-Routen (`src/app/api/`) verwendet werden — niemals im Client-Code
- **`NEXT_PUBLIC_*`** Variablen sind sicher für den Browser (anon key, eingeschränkte Rechte)
- **Keine API Keys** hardcoden — immer aus `process.env` lesen
- Alle externen API-Calls (OpenAI, Anthropic) laufen NUR in Route Handlers

---

## Konventionen

### Datei-Struktur
```
src/app/api/           → Route Handlers (Server-seitig)
src/lib/rag/           → RAG Pipeline (chunker, embedder, retriever, generator)
src/lib/supabase/      → Supabase Clients (client.ts = Browser, server.ts = Server)
src/components/chat/   → Chat-UI-Komponenten
src/components/admin/  → Admin-UI-Komponenten
src/components/ui/     → WorkspaceSelector
src/types/             → Shared TypeScript Types
```

### Workspace-System
- Default Workspace Slug: `"default"` — Everlast AI Produktdokumentation (8 Docs)
- Demo Workspace Slug: `"demo"` — Enterprise-Docs, Migration, API-Changelog (3 Docs)
- KI Workspace Slug: `"ki"` — KI/ML/LLM Wissensartikel (10 Docs)
- Alle DB-Queries MÜSSEN nach `workspace_id` filtern (Isolation)
- Frontend sendet `workspaceSlug` mit jedem Request
- Neue Workspaces in `WorkspaceSelector.tsx` und `ChatInterface.tsx` (SUGGESTIONS + WORKSPACE_META) ergänzen

### RAG-Pipeline
- Chunk-Größe: 512 Tokens (~2048 Zeichen), Overlap: 50 Tokens
- Token-Schätzung: `Math.ceil(text.length / 4)` (bewusste Vereinfachung, documented)
- Embedding-Batch: max. 100 Chunks pro OpenAI-Call
- Similarity-Threshold: **0.3**, Top-K: 5
- LLM-Temperature: 0.1 (niedrig = faktentreu)
- `x-sources` Header ist URL-kodiert (`encodeURIComponent`) — Unicode-Sonderzeichen würden HTTP ByteString-Fehler verursachen

### Supabase
- Server Client: `createServerClient()` aus `src/lib/supabase/server.ts`
- Browser Client: `createBrowserClient()` aus `src/lib/supabase/client.ts`
- Similarity-Suche via `match_chunks()` RPC-Funktion (kein ORM)

### Streaming
- Kein Vercel AI SDK `useChat` — eigener `ReadableStream`-Reader in `ChatInterface.tsx`
- Quellzitate kommen aus `x-sources` Response-Header (URL-decoded nach dem Stream)
- Während des Streams: `sources === undefined` → Typing-Indicator; nach Stream: `sources = []` oder gefülltes Array

---

## Seed-Daten

- `scripts/seed.ts` — befüllt alle 3 Workspaces mit Duplikat-Schutz
- Aufruf: `npx ts-node scripts/seed.ts`
- Voraussetzung: `.env.local` mit allen Keys befüllt + `supabase/schema.sql` angewendet
- Duplikat-Schutz: prüft vor Insert ob Dokument (workspace_id + title) bereits existiert → skip

---

## Wichtige Dateien

| Datei | Zweck |
|-------|-------|
| `supabase/schema.sql` | Muss zuerst im Supabase SQL-Editor ausgeführt werden |
| `scripts/seed.ts` | Befüllt DB mit Demo-Daten (alle 3 Workspaces) |
| `src/app/api/query/route.ts` | Kern der RAG-Pipeline |
| `src/lib/rag/chunker.ts` | Text-Splitting-Logik |
| `src/components/chat/ChatInterface.tsx` | Haupt-Chat-UI mit eigenem ReadableStream-Reader |
| `src/components/ui/WorkspaceSelector.tsx` | Workspace-Dropdown (hardcoded Liste) |
| `.mcp.json` | Playwright MCP-Konfiguration für Browser-Tests |

---

## Nicht-Ziele (für diese Challenge)

- Keine Benutzer-Authentifizierung (Service Role für alle DB-Operationen)
- Kein Rate Limiting (Produktions-Feature, im README als "Next Steps" erwähnt)
- Keine PDF-Upload-Funktion (Text-Paste reicht für die Demo)
- Kein Testing-Framework (Playwright MCP für manuelle E2E-Tests eingerichtet)
- Kein ORM — direkte Supabase-Client-Calls
