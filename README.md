# Everlast AI — RAG Wissensassistent

Ein vollständiges Retrieval-Augmented Generation (RAG) System, gebaut mit Next.js 14 und Supabase. Stelle Fragen und erhalte präzise, zitierte Antworten auf Basis einer eigenen Wissensbasis.

**Live-Demo:** *(Vercel-URL nach Deployment eintragen)*

---

## Problem & Ansatz

Klassische LLMs antworten ausschließlich auf Basis ihrer Trainingsdaten — das führt zu Halluzinationen und veralteten Informationen. Dieses Projekt implementiert RAG: Dokumente werden in Chunks aufgeteilt, als Vektoren eingebettet, in Supabase (pgvector) gespeichert und zur Anfragezeit abgerufen, um die Antwort des LLMs in eigenem Inhalt zu verankern.

Die Wissensbasis besteht aus fiktiver **Everlast AI Produktdokumentation** — ein meta-kreativer Ansatz, bei dem das System Fragen über sich selbst beantwortet.

---

## Architektur

```
Browser
  │
  ├── /chat         Chat-UI (eigenes Fetch → ReadableStream)
  └── /admin        Dokument-Verwaltung
        │
        ▼
  Next.js Route Handlers
  ├── POST /api/query    einbetten → pgvector-Suche → Claude-Stream
  ├── POST /api/ingest   aufteilen → batch-einbetten → Supabase-Insert
  └── GET  /api/documents auflisten + löschen
        │
        ├── OpenAI API (text-embedding-3-small)
        ├── Anthropic API (claude-haiku-4-5)
        └── Supabase Postgres
              ├── workspaces  (Multi-Tenant-Isolation)
              ├── documents   (übergeordnete Datensätze)
              └── chunks      (vector(1536) Embeddings)
                    └── match_chunks() RPC (Kosinus-Ähnlichkeit)
```

### Datenmodell

```sql
workspaces  id, slug, name
documents   id, workspace_id, title, source_url, metadata, created_at
chunks      id, document_id, workspace_id, content, chunk_index,
            token_count, embedding vector(1536), created_at
```

`workspace_slug` ist auf `chunks` denormalisiert, um einen Join auf dem heißen Retrieval-Pfad zu vermeiden.

---

## Setup

### Voraussetzungen

- Node.js 18+
- Supabase-Konto (kostenlose Stufe ausreichend)
- OpenAI API-Key (für Embeddings)
- Anthropic API-Key (für die Generierung)

### 1. Klonen & installieren

```bash
git clone <repo-url>
cd everlast-rag
npm install
```

### 2. Umgebungsvariablen konfigurieren

```bash
cp .env.example .env.local
# .env.local bearbeiten und alle 5 Werte eintragen
```

Erforderliche Variablen:

| Variable | Bezugsquelle |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Projekteinstellungen → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Projekteinstellungen → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Projekteinstellungen → API |
| `OPENAI_API_KEY` | platform.openai.com → API Keys |
| `ANTHROPIC_API_KEY` | console.anthropic.com → API Keys |

### 3. Supabase-Schema anwenden

Den **Supabase SQL-Editor** öffnen und den Inhalt von `supabase/schema.sql` ausführen. Damit werden die Tabellen `workspaces`, `documents` und `chunks`, der pgvector-Index sowie die `match_chunks`-RPC-Funktion erstellt.

> Die `vector`-Extension muss aktiviert sein: Supabase → Datenbank → Extensions → vector

### 4. Wissensbasis befüllen

```bash
npx ts-node scripts/seed.ts
```

Importiert die Wissensbasis in alle drei Workspaces (Duplikat-Schutz eingebaut):
- `default` — 8 fiktive Everlast AI Produktdokumente (~16 Chunks)
- `demo` — 3 Enterprise-Docs (Migration, API-Changelog, Enterprise-Features, ~6 Chunks)
- `ki` — 10 Dokumente über Künstliche Intelligenz (~31 Chunks)

Dauert ~60–120 Sekunden (OpenAI Embedding-Aufrufe für alle drei Workspaces).

### 5. Starten

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) öffnen — leitet automatisch auf `/chat` weiter.

---

## Verwendung

**Chat (`/chat`):**

Fragen stellen — Antworten werden in Echtzeit gestreamt mit einklappbaren Quellenangaben.

Beispiel-Fragen je Workspace:
- `default` — „Was ist Everlast AI?", „Wie funktioniert die RAG-Engine?", „Was kosten die Tarife?"
- `demo` — „Was bietet die Enterprise Edition?", „Was ist neu in API v2.1?"
- `ki` — „Wie funktionieren LLMs?", „Was ist das Alignment-Problem?"

**Chat-Features:**
- Suggestion Chips — 1 Klick sendet direkt ab (kein manuelles Enter)
- Copy-Button — erscheint beim Hover über KI-Antworten
- Neues-Gespräch-Button — leert den Chat, Workspace bleibt erhalten
- Workspace-spezifischer Placeholder und Titel
- Hinweis wenn keine Dokumente in der Wissensbasis gefunden wurden

**Verwaltung (`/admin`):**

Beliebiges Dokument einfügen und auf „Dokument importieren" klicken. Das System teilt es automatisch auf, bettet es ein und speichert es. Neue Dokumente sind sofort abfragbar. Bestehende Dokumente können einzeln gelöscht werden.

**Workspace-Wechsel:** Das Dropdown in der Kopfzeile wechselt zwischen den drei Workspaces. Jeder Workspace hat vollständige Datenisolierung — komplett andere Wissensbasis, komplett andere Antworten.

---

## Multi-Workspace-Unterstützung

Die Plattform unterstützt vollständige Mandantentrennung über Workspaces.

**Wie es funktioniert:**
- Jeder Workspace ist eine isolierte Einheit mit eigenem Dokument- und Chunk-Pool
- Die `match_chunks()`-Datenbankfunktion filtert ausschließlich Chunks des angeforderten Workspaces
- `workspace_slug` ist auf der `chunks`-Tabelle denormalisiert → kein Join auf dem Retrieval-Pfad
- Alle API-Endpunkte (`/api/query`, `/api/ingest`, `/api/documents`) erwarten `workspaceSlug`

**In der Demo:**
- `default` — Everlast AI Produktdokumentation (8 Dokumente)
- `demo` — Enterprise-Docs: Features, Migration, API-Changelog (3 Dokumente)
- `ki` — KI-Wissensbasis: Machine Learning, Deep Learning, LLMs, Ethik, Zukunft (10 Dokumente)

**Neuen Workspace anlegen:**
```sql
INSERT INTO workspaces (slug, name) VALUES ('mein-team', 'Mein Team');
```
Danach ist der neue Workspace sofort über die API nutzbar. Dokumente über `/admin` oder `/api/ingest` einpflegen.

---

## Design-Entscheidungen

### Warum OpenAI für Embeddings + Anthropic für Generierung?
Das beste Werkzeug für jede Aufgabe. `text-embedding-3-small` (1536 Dimensionen) ist das Industrie-Standardmodell für RAG-Embeddings — hohe Qualität, geringe Kosten (~$0,002/1M Tokens), starke mehrsprachige Unterstützung. `claude-haiku-4-5` ist schnell, kosteneffizient und exzellent bei der Befolgung von Anweisungen — entscheidend, um den Assistenten auf den abgerufenen Kontext zu beschränken.

### Warum pgvector statt Pinecone/Qdrant?
Eine Single-Database-Architektur vereinfacht den Betrieb erheblich. Supabase + pgvector ist produktionsreif und eliminiert die Notwendigkeit, einen separaten Vektordatenbank-Dienst zu betreiben. Der Kompromiss: Sehr große Datensätze (>10M Chunks) würden von dedizierter Vektordatenbank-Infrastruktur profitieren — auf Demo-Skala ist das jedoch kein Problem.

### Chunking-Strategie
Rekursives Zeichenaufteilen: Absatzumbrüche → Satzgrenzen → Wortgrenzen. 512-Token-Chunks mit 50-Token-Überlappung. Token-Anzahl wird als `text.length / 4` geschätzt (Heuristik) statt tiktoken zu verwenden, was eine schwere WASM-Abhängigkeit in der API-Route vermeidet. Dies ist als bekannte Vereinfachung dokumentiert.

### Kein Streaming via AI SDK `useChat`
Die aktuelle Version des Vercel AI SDK (v6) hat breaking changes, die `StreamData` und die `useChat`-Architektur grundlegend verändert haben. Stattdessen wurde ein eigener `ReadableStream`-Reader in `ChatInterface.tsx` implementiert — robuster und unabhängig von SDK-Versionssprüngen. Quellzitate werden über den `x-sources`-Response-Header übermittelt (URL-kodiert wegen HTTP ByteString-Constraint).

### Kein Auth
Bewusst für den Challenge-Scope ausgeschlossen. In Produktion würde Supabase Auth mit RLS-Policies verwendet, die an `user_id` und `workspace_id` geknüpft sind.

---

## Projektstruktur

```
src/
  app/
    chat/page.tsx         Chat-UI
    admin/page.tsx        Dokumentverwaltung
    api/
      query/route.ts      RAG-Pipeline-Endpunkt
      ingest/route.ts     Dokument-Import-Endpunkt
      documents/route.ts  Auflisten + Löschen
  lib/
    rag/
      chunker.ts          Rekursiver Text-Splitter
      embedder.ts         OpenAI Batch-Embedding
      retriever.ts        Supabase pgvector-Suche
      generator.ts        Claude Streaming-Generierung
    supabase/
      server.ts           Service-Role-Client (nur API-Routes)
      client.ts           Anon-Client (Browser)
  components/
    chat/                 Chat-UI-Komponenten
    admin/                Admin-UI-Komponenten
    layout/               Header + Navigation
    ui/                   WorkspaceSelector
  types/index.ts          Gemeinsame TypeScript-Typen
supabase/schema.sql       Datenbankschema
scripts/seed.ts           Wissensbasis-Seed-Skript (alle 3 Workspaces)
```

---

## Ausblick (für Produktion)

- **Auth**: Supabase Auth + RLS-Policies pro Workspace
- **Rate Limiting**: Redis-basierter Rate-Limiter auf `/api/query`
- **PDF-Import**: PDF.js Textextraktion + OCR für gescannte Dokumente
- **Evaluierungs-Framework**: RAGAS oder eigene Metriken für Retrieval-Qualität
- **HNSW-Index**: IVFFlat durch HNSW ersetzen für besseren Recall bei großen Datensätzen
- **Hintergrund-Import**: Embedding-Aufrufe in Supabase Edge Functions auslagern
- **Streaming-Fortschritt**: WebSocket oder SSE für Echtzeit-Fortschritt bei langen Imports
- **Testing**: Playwright E2E-Tests (MCP bereits eingerichtet), Jest für Unit-Tests der RAG-Pipeline
