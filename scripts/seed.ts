/**
 * Seed script — ingests the fictional Everlast AI knowledge base
 * Run with: npx ts-node scripts/seed.ts
 * Requires: .env.local with all API keys set
 */

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ============================================================
// Fictional Everlast AI Product Documentation
// ============================================================

const KNOWLEDGE_BASE = [
  {
    title: 'Was ist Everlast AI?',
    content: `Everlast AI ist eine enterprise-taugliche Plattform für Wissensmanagement und Frage-Antwort-Systeme, angetrieben durch Retrieval-Augmented Generation (RAG). Gegründet 2023 hilft Everlast AI Unternehmen dabei, den Wert ihrer Dokumente, Wikis und internen Wissensbasen freizusetzen — indem es diese sofort durchsuchbar und gesprächsfähig macht.

Unsere Mission ist es, institutionelles Wissen für jeden in einer Organisation zugänglich zu machen — von neuen Mitarbeitenden am ersten Tag bis hin zu Führungskräften, die in kritischen Momenten schnelle Antworten benötigen.

Kernfunktionen:

Wissens-Import: Lade Dokumente, PDFs, Markdown-Dateien hoch oder füge Text direkt ein. Everlast AI teilt deinen Inhalt automatisch in Chunks auf, erstellt Embeddings und indiziert alles für die semantische Suche.

Konversationelles Frage-Antwort-System: Stelle Fragen in natürlicher Sprache und erhalte präzise, zitierte Antworten, die auf den eigenen Dokumenten deiner Organisation basieren — keine Halluzinationen.

Multi-Workspace-Unterstützung: Organisiere dein Wissen in isolierten Workspaces für verschiedene Teams, Produkte oder Kundenkonten. Jeder Workspace garantiert vollständige Datentrennung.

Quellenangaben: Jede Antwort enthält Verweise auf die genauen Quelldokumente und Textpassagen — für vollständige Transparenz und Nachvollziehbarkeit.

Streaming-Antworten: Antworten werden in Echtzeit gestreamt, während sie generiert werden — für ein reaktionsfähiges, chat-ähnliches Erlebnis auch bei komplexen Anfragen.

Everlast AI basiert auf moderner, produktionsreifer Infrastruktur: Next.js für Frontend und API, Supabase mit pgvector für skalierbare Vektorspeicherung und führende Sprachmodelle für die Generierung.`,
  },
  {
    title: 'Erste Schritte — Einführungsleitfaden',
    content: `Willkommen bei Everlast AI! Dieser Leitfaden führt dich in weniger als 10 Minuten durch die Einrichtung deiner ersten Wissensbasis.

Schritt 1: Konto erstellen

Besuche app.everlast.ai und klicke auf "Kostenlos starten". Du kannst dich mit Google, GitHub oder einer geschäftlichen E-Mail-Adresse registrieren. Ein Standard-Workspace mit dem Namen deiner Organisation wird automatisch beim Registrieren angelegt.

Schritt 2: Dashboard aufrufen

Nach dem Einloggen landest du auf dem Haupt-Dashboard. Die linke Seitenleiste zeigt deine Workspaces, und die obere Navigation gibt dir Zugang zu den Bereichen Chat und Verwaltung.

Schritt 3: Erstes Dokument importieren

Gehe zu Verwaltung und klicke auf "Dokument hinzufügen". Du kannst:
- Textinhalt direkt in das Textfeld einfügen
- Einen beschreibenden Titel festlegen (z.B. "Produkt-Roadmap Q3 2024")
- Optional eine Quell-URL als Referenz hinzufügen

Klicke auf "Dokument importieren". Everlast AI teilt dein Dokument automatisch in semantische Chunks auf, erstellt Embeddings und speichert sie. Dies dauert je nach Dokumentlänge normalerweise 5 bis 30 Sekunden.

Schritt 4: Erste Frage stellen

Wechsle zum Chat-Tab. Wähle deinen Workspace aus dem Dropdown und tippe eine Frage zum gerade importierten Dokument. Du siehst eine gestreamte Antwort mit Quellenangaben darunter erscheinen.

Schritt 5: Team einladen

Gehe zu Einstellungen und lade Kollegen per E-Mail ein. Jedes Teammitglied erhält Zugang zur gemeinsamen Wissensbasis des Workspaces.

Tipps für beste Ergebnisse:
- Verwende klare, beschreibende Dokumenttitel — sie erscheinen in den Quellenangaben
- Teile große Dokumente vor dem Hochladen in logische Abschnitte auf
- Das System funktioniert am besten mit mindestens 5 bis 10 Dokumenten in einem Workspace
- Fragen, die der Sprache deiner Dokumente ähneln, liefern die genauesten Antworten`,
  },
  {
    title: 'Preise und Tarife',
    content: `Everlast AI bietet drei Preisstufen für Teams jeder Größe.

Kostenloser Tarif

Preis: 0 Euro pro Monat, dauerhaft kostenlos
Enthält:
- 1 Workspace
- Bis zu 50 Dokumente
- Bis zu 500 Fragen pro Monat
- 5 MB Speicher für Embeddings
- Community-Support via Discord

Ideal für: Einzelne Entwickler, kleine Projekte und die Evaluierung der Plattform.

Pro-Tarif

Preis: 49 Euro pro Monat und Workspace
Enthält:
- Unbegrenzte Dokumente
- Unbegrenzte Fragen
- 10 GB Speicher für Embeddings
- Bis zu 5 Teammitglieder
- Priorisierter E-Mail-Support (24 Stunden Reaktionszeit)
- API-Zugang mit 10.000 Anfragen pro Monat
- Eigenes Branding in der Chat-Oberfläche
- Erweitertes Analytics-Dashboard

Ideal für: Kleine Teams, Startups und Abteilungen, die interne Dokumentation verwalten.

Enterprise-Tarif

Preis: Individuell (Kontakt: sales@everlast.ai)
Enthält alles aus Pro, zusätzlich:
- Unbegrenzte Workspaces
- Unbegrenzte Teammitglieder
- SSO/SAML-Integration
- Individuelle SLAs und dedizierter Support
- On-Premises- oder Private-Cloud-Deployment-Optionen
- SOC 2 Typ II Compliance-Dokumentation
- Individuelle Datenaufbewahrungsrichtlinien
- Erweiterte Audit-Logs
- Mengenrabatte auf API-Nutzung

Ideal für: Große Organisationen, regulierte Branchen und Unternehmen mit strengen Datensouveränitätsanforderungen.

Häufige Fragen zu den Preisen:

F: Kann ich den Tarif wechseln?
A: Ja, du kannst jederzeit up- oder downgraden. Upgrades werden sofort wirksam; Downgrades gelten ab dem nächsten Abrechnungszeitraum.

F: Gibt es eine kostenlose Testphase für Pro?
A: Ja, neue Konten erhalten eine 14-tägige Pro-Testphase für ihren ersten Workspace, ohne Kreditkarte erforderlich.

F: Was passiert, wenn ich mein monatliches Fragenlimit im kostenlosen Tarif überschreite?
A: Fragen werden vorübergehend pausiert, bis der nächste Abrechnungszeitraum dein Kontingent zurücksetzt. Du erhältst eine E-Mail-Warnung bei 80 % der Nutzung.`,
  },
  {
    title: 'Wie die RAG-Engine funktioniert',
    content: `Everlast AI verwendet eine Retrieval-Augmented Generation (RAG) Architektur, um präzise, fundierte Antworten zu liefern. Dieses Dokument erklärt, wie das System unter der Haube funktioniert.

Überblick

Traditionelle Sprachmodelle beantworten Fragen ausschließlich aus ihren Trainingsdaten, was zu veralteten Informationen und Halluzinationen führt. RAG löst dieses Problem, indem es zur Anfragezeit relevante Passagen aus deinen Dokumenten abruft und diese als Kontext für das Sprachmodell bereitstellt. Das Modell generiert dann eine Antwort, die ausschließlich auf dem abgerufenen Kontext basiert.

Die vierstufige Pipeline

Schritt 1: Dokument-Import

Wenn du ein Dokument hochlädst, führt Everlast AI folgende Schritte durch:
1. Aufteilung des Textes in überlappende Chunks (ca. 512 Tokens pro Chunk, mit 50-Token-Überlappung, um keine Informationen an den Grenzen zu verlieren)
2. Jeder Chunk wird an das text-embedding-3-small Modell von OpenAI gesendet, um einen 1536-dimensionalen Embedding-Vektor zu erzeugen
3. Die Chunks und ihre Embeddings werden in der PostgreSQL-Datenbank von Supabase mit der pgvector-Extension gespeichert

Die Chunking-Strategie verwendet rekursives Zeichenaufteilen: zuerst an Absatzumbrüchen, dann an Satzgrenzen, dann an Wortgrenzen — um die semantische Kohärenz so gut wie möglich zu erhalten.

Schritt 2: Anfrage-Embedding

Wenn du eine Frage stellst, wird deine Frage sofort mit demselben OpenAI-Embedding-Modell eingebettet. Dadurch wird deine Frage in einen 1536-dimensionalen Vektor im selben semantischen Raum wie deine Dokument-Chunks umgewandelt.

Schritt 3: Semantisches Retrieval

Der Anfrage-Vektor wird mit allen gespeicherten Chunk-Vektoren mittels Kosinus-Ähnlichkeit verglichen. Die pgvector-Extension von Supabase behandelt diesen Vergleich effizient mit einem IVFFlat-Index. Die 5 ähnlichsten Chunks werden abgerufen. Dieser Schwellenwert stellt sicher, dass nur wirklich relevante Passagen einbezogen werden.

Schritt 4: Fundierte Generierung

Die abgerufenen Chunks und deine Frage werden zu einem Prompt für Claude, Anthropics Sprachmodell, zusammengestellt. Der System-Prompt weist das Modell strikt an, nur auf Basis des bereitgestellten Kontexts zu antworten, um Halluzinationen zu verhindern. Die Antwort wird in Echtzeit an deinen Browser gestreamt.

Warum das wichtig ist

- Genauigkeit: Antworten basieren auf deinen spezifischen Dokumenten, nicht auf allgemeinen Trainingsdaten
- Nachvollziehbarkeit: Jede Antwort zitiert ihre Quellen, sodass du die Herkunft jeder Aussage prüfen kannst
- Aktualität: Füge jederzeit neue Dokumente hinzu — sie sind sofort abfragbar
- Datenschutz: Deine Dokumente werden eingebettet und in deinem eigenen Workspace gespeichert, niemals zum Training von KI-Modellen verwendet`,
  },
  {
    title: 'Unterstützte Integrationen',
    content: `Everlast AI verbindet sich mit den Tools, die dein Team bereits verwendet. Hier ist eine umfassende Übersicht der verfügbaren Integrationen.

Native Integrationen (jetzt verfügbar)

Slack
Installiere die Everlast AI Slack-App, um Fragen direkt in Slack-Kanälen oder Direktnachrichten zu stellen. Verwende den /ask-Befehl gefolgt von deiner Frage. Antworten werden mit Quellenangaben in einer Thread-Antwort zurückgegeben. Konfiguriere, welchen Workspace du abfragen möchtest, in deinen Slack-Einstellungen.

Notion
Die Notion-Integration ermöglicht es dir, ganze Notion-Datenbanken, Seiten und Wikis in Everlast AI Workspaces zu synchronisieren. Verbinde dich über Einstellungen, wähle Integrationen und dann Notion aus und erteile Lesezugriff. Seiten werden automatisch alle 24 Stunden synchronisiert oder du kannst eine manuelle Synchronisierung vom Dashboard aus starten.

Salesforce
Synchronisiere Salesforce Knowledge Base-Artikel, Fallbeschreibungen und Produktdokumentation in einen dedizierten Workspace. Nützlich für Kundensupport-Teams, die schnellen Zugang zu Produktinformationen während Kundeninteraktionen benötigen.

HubSpot
Verbinde deinen HubSpot Content Hub, um Blog-Beiträge, Knowledge Base-Artikel und Sales-Enablement-Materialien zu importieren. Halte dein RAG-System aktuell, wenn sich deine Marketing-Inhalte weiterentwickeln.

REST API
Greife programmatisch auf alle Everlast AI-Funktionen zu. Die API ist RESTful, verwendet JSON und erfordert API-Schlüssel-Authentifizierung via Bearer Token. Verfügbar im Pro- und Enterprise-Tarif.

API-Endpunkte:
- POST /v1/ingest — Dokumente programmatisch importieren
- POST /v1/query — Fragen einreichen und Antworten erhalten
- GET /v1/documents — Dokumente in einem Workspace auflisten
- DELETE /v1/documents/{id} — Ein Dokument entfernen

Zapier und Make (demnächst)
No-Code-Automatisierungsintegration, um Everlast AI mit über 5.000 Apps zu verbinden. Löse den Dokument-Import durch Google Drive-Uploads, Airtable-Updates oder andere unterstützte Trigger aus.

Confluence (demnächst)
Direkte Synchronisierung mit Atlassian Confluence Spaces — ideal für Entwicklungs- und Produktteams mit großen internen Wikis.

Unterstützte Dateiformate:
- Normaler Text (.txt)
- Markdown (.md)
- PDF (.pdf) — nur Textextraktion, kein OCR
- Word-Dokumente (.docx)
- CSV (wird als strukturierter Text importiert)

Maximale Dateigröße: 10 MB pro Dokument im Pro-Tarif, 50 MB im Enterprise-Tarif.`,
  },
  {
    title: 'Datenschutz und Sicherheit',
    content: `Everlast AI nimmt Datensicherheit und Datenschutz ernst. Dieses Dokument erläutert, wie wir deine Daten schützen und relevante Vorschriften einhalten.

Infrastruktur-Sicherheit

Everlast AI wird auf enterprise-tauglicher Cloud-Infrastruktur mit folgenden Sicherheitskontrollen gehostet:

- Daten im Ruhezustand: Alle Daten sind mit AES-256-Verschlüsselung gesichert
- Daten in der Übertragung: Alle Kommunikationen verwenden TLS 1.3 oder höher
- Datenbank: Supabase (PostgreSQL) mit pgvector auf dedizierten Instanzen
- Backups: Automatisierte tägliche Backups mit 30-tägiger Aufbewahrung im Pro-Tarif, 1 Jahr im Enterprise-Tarif

Datenisolierung

Jeder Workspace ist auf Datenbankebene streng isoliert:
- Dokumente und Embeddings sind auf einen einzelnen Workspace beschränkt
- Multi-Tenant-Abfragen werden durch Row Level Security (RLS) Richtlinien durchgesetzt
- API-Schlüssel gewähren nur Zugang zu bestimmten Workspaces
- Enterprise-Deployments können dedizierte Datenbankinstanzen wählen

Deine Daten und KI-Modelle

Everlast AI verwendet Drittanbieter-KI-APIs für die Embedding-Generierung und Antwortgenerierung. Wichtige Punkte:
- OpenAI API wird für die Embedding-Generierung verwendet (text-embedding-3-small). Gemäß der OpenAI API-Richtlinie werden über die API übermittelte Daten nicht zum Training ihrer Modelle verwendet.
- Anthropic API wird für die Antwortgenerierung verwendet. Gemäß Anthropics API-Richtlinie werden übermittelte Daten nicht für das Training verwendet.
- Deine Dokumente werden nie über die Dauer des API-Aufrufs hinaus auf Servern von KI-Anbietern gespeichert.
- Everlast AI-Mitarbeiter greifen nicht auf Kundendaten zu, außer wenn dies für den Support mit ausdrücklicher Zustimmung des Kunden erforderlich ist.

Compliance

SOC 2 Typ II: Everlast AI hält eine SOC 2 Typ II-Zertifizierung. Bericht ist für Enterprise-Kunden unter NDA verfügbar.

DSGVO: Everlast AI ist DSGVO-konform. Wir handeln als Datenverarbeiter im Auftrag unserer Kunden. Datenverarbeitungsvereinbarungen (DVV) sind auf Anfrage erhältlich.

Datensitz: Enterprise-Kunden können EU (Frankfurt) oder USA (Virginia) als Datensitz wählen. Anfragen für andere Regionen werden individuell behandelt.

Sicherheitskontakt

Um eine Sicherheitslücke zu melden, schreibe an security@everlast.ai. Wir betreiben ein Responsible-Disclosure-Programm und streben eine Antwort innerhalb von 24 Stunden an.`,
  },
  {
    title: 'Häufig gestellte Fragen (FAQ)',
    content: `Allgemeine Fragen

F: Welche Sprachen unterstützt Everlast AI?
A: Everlast AI funktioniert am besten mit deutschen und englischen Inhalten, unterstützt aber jede Sprache, für die das text-embedding-3-small Modell von OpenAI gute Embeddings liefert. Dazu gehören alle wichtigen europäischen Sprachen, Japanisch, Chinesisch, Koreanisch und viele andere. Die Leistung kann für weniger verbreitete Sprachen variieren.

F: Wie genau sind die Antworten?
A: Die Genauigkeit hängt stark von der Qualität und Abdeckung deiner Wissensbasis ab. Wenn ein relevantes Dokument vorhanden ist, liefert Everlast AI typischerweise sehr genaue Antworten, da es exakte Passagen abruft statt auf das Modellgedächtnis zu setzen. Falls kein relevantes Dokument vorhanden ist, teilt das System ehrlich mit, dass es keine Informationen zu diesem Thema hat, anstatt eine Antwort zu halluzinieren.

F: Kann ich PDF-Dateien hochladen?
A: Ja, im Pro- und Enterprise-Tarif. Das System extrahiert automatisch Text aus PDFs. Beachte, dass gescannte PDFs (bildbasiert) OCR erfordern, das nur im Enterprise-Tarif verfügbar ist.

F: Wie lange dauert der Import?
A: Typische Import-Zeiten:
- Kurzes Dokument (1 bis 2 Seiten): 5 bis 15 Sekunden
- Mittleres Dokument (10 bis 20 Seiten): 30 bis 90 Sekunden
- Großes Dokument (100 oder mehr Seiten): 2 bis 10 Minuten

F: Wie viele Dokumente sollte ich für gute Ergebnisse importieren?
A: Mehr Dokumente bedeuten generell bessere Abdeckung. Für ein gutes Erlebnis empfehlen wir mindestens 5 bis 10 fokussierte Dokumente in einem Workspace. Das System skaliert gut auf Tausende von Dokumenten.

Technische Fragen

F: Welches Embedding-Modell wird verwendet?
A: Das text-embedding-3-small Modell von OpenAI (1536 Dimensionen). Wir haben dieses Modell wegen seines hervorragenden Qualitäts-Kosten-Verhältnisses und der starken mehrsprachigen Unterstützung gewählt.

F: Kann ich mein eigenes Embedding-Modell verwenden?
A: Enterprise-Kunden können ihr eigenes Embedding-Modell über die API einbringen. Kontaktiere den Vertrieb für Details.

F: Was sind die Standardeinstellungen für Chunk-Größe und Überlappung?
A: Standard-Chunk-Größe ist 512 Tokens mit 50-Token-Überlappung. Diese sind im Enterprise-Tarif konfigurierbar.

F: Unterstützt Everlast AI Echtzeit-Dokumentaktualisierungen?
A: Dokumente können jederzeit neu importiert werden. Die alte Version wird durch die neue ersetzt. Native Dokumentsynchronisierung aktualisiert sich im Pro-Tarif alle 24 Stunden.

F: Gibt es ein Rate-Limit für die API?
A: Pro-Tarif: 10.000 Anfragen pro Monat, maximal 60 Anfragen pro Minute. Enterprise: individuelle Limits.

Abrechnungsfragen

F: Werden ungenutzte Fragen auf den nächsten Monat übertragen?
A: Nein, monatliche Fragenkontingente werden zu Beginn jedes Abrechnungszeitraums zurückgesetzt und nicht übertragen.

F: Kann ich jederzeit kündigen?
A: Ja, du kannst dein Abonnement jederzeit kündigen. Der Zugang bleibt bis zum Ende deines bezahlten Zeitraums erhalten.

F: Gibt es Rabatte für Bildungseinrichtungen oder gemeinnützige Organisationen?
A: Ja, Bildungseinrichtungen und eingetragene gemeinnützige Organisationen erhalten 50 % Rabatt auf Pro-Tarife. Kontaktiere support@everlast.ai mit einem Nachweis.`,
  },
  {
    title: 'API-Referenz Übersicht',
    content: `Die Everlast AI API ermöglicht es dir, RAG-Funktionen programmatisch in deine eigenen Anwendungen zu integrieren. Dieses Dokument gibt einen Überblick über Authentifizierung, wichtige Endpunkte und Nutzungsmuster.

Authentifizierung

Alle API-Anfragen müssen einen Bearer Token im Authorization-Header enthalten:

Authorization: Bearer ea_live_xxxxxxxxxxxxxxxxxxxx

Generiere API-Schlüssel in deinem Dashboard unter Einstellungen. Schlüssel sind workspace-gebunden — jeder Schlüssel kann nur auf Dokumente innerhalb des ihm zugewiesenen Workspaces zugreifen.

Basis-URL

Alle API-Endpunkte sind verfügbar unter:
https://api.everlast.ai/v1

Rate-Limits

Pro-Tarif: 60 Anfragen pro Minute, 10.000 Anfragen pro Monat
Enterprise: Individuelle Limits

Bei überschrittenem Rate-Limit gibt die API HTTP 429 mit einem Retry-After-Header zurück, der angibt, wann ein erneuter Versuch möglich ist.

Wichtige Endpunkte

POST /v1/ingest — Dokument in deinen Workspace importieren
POST /v1/query — Frage einreichen und fundierte Antwort erhalten
GET /v1/documents — Alle Dokumente in deinem Workspace auflisten
DELETE /v1/documents/{id} — Dokument und alle seine Chunks löschen

Fehlercodes

400 Bad Request — Ungültiger Anfrage-Body oder fehlende Pflichtfelder
401 Unauthorized — Fehlender oder ungültiger API-Schlüssel
404 Not Found — Dokument oder Workspace nicht gefunden
429 Too Many Requests — Rate-Limit überschritten
500 Internal Server Error — Kontaktiere support@everlast.ai

SDKs

Offizielle SDKs sind verfügbar für:
- JavaScript/TypeScript: npm install @everlast-ai/sdk
- Python: pip install everlast-ai
- Go: go get github.com/everlast-ai/go-sdk

Community-SDKs gibt es für Ruby, PHP und Rust — siehe unsere GitHub-Organisation.`,
  },
];

// ============================================================
// Seed Functions
// ============================================================

async function chunkText(text: string): Promise<string[]> {
  const MAX_CHARS = 2048; // ~512 tokens
  const OVERLAP_CHARS = 200; // ~50 tokens

  const paragraphs = text.split(/\n\n+/).filter((p) => p.trim().length > 0);
  const chunks: string[] = [];
  let current = '';

  for (const para of paragraphs) {
    const candidate = current ? `${current}\n\n${para}` : para;
    if (candidate.length <= MAX_CHARS) {
      current = candidate;
    } else {
      if (current) chunks.push(current);
      current = para.length > MAX_CHARS ? para.slice(0, MAX_CHARS) : para;
    }
  }
  if (current.trim()) chunks.push(current);

  // Apply overlap
  return chunks.map((chunk, i) => {
    if (i === 0) return chunk;
    const tail = chunks[i - 1].slice(-OVERLAP_CHARS);
    return `${tail} ${chunk}`.trim();
  });
}

async function embedBatch(texts: string[]): Promise<number[][]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: texts,
  });
  return response.data.sort((a, b) => a.index - b.index).map((d) => d.embedding);
}

async function ingestDocument(
  workspaceId: string,
  title: string,
  content: string
): Promise<{ chunksCreated: number; skipped?: boolean }> {
  // Skip if document with same title already exists in workspace
  const { data: existing } = await supabase
    .from('documents')
    .select('id')
    .eq('workspace_id', workspaceId)
    .eq('title', title)
    .maybeSingle();

  if (existing) {
    return { chunksCreated: 0, skipped: true };
  }

  // Insert document
  const { data: doc, error: docErr } = await supabase
    .from('documents')
    .insert({ workspace_id: workspaceId, title })
    .select('id')
    .single();

  if (docErr || !doc) throw new Error(`Doc insert failed: ${docErr?.message}`);

  // Chunk
  const chunks = await chunkText(content);

  // Embed in batches of 100
  const allEmbeddings: number[][] = [];
  for (let i = 0; i < chunks.length; i += 100) {
    const batch = chunks.slice(i, i + 100);
    const embeddings = await embedBatch(batch);
    allEmbeddings.push(...embeddings);
  }

  // Insert chunks
  const rows = chunks.map((text, i) => ({
    document_id: doc.id,
    workspace_id: workspaceId,
    content: text,
    chunk_index: i,
    token_count: Math.ceil(text.length / 4),
    embedding: allEmbeddings[i],
  }));

  const { error: chunksErr } = await supabase.from('chunks').insert(rows);
  if (chunksErr) throw new Error(`Chunks insert failed: ${chunksErr.message}`);

  return { chunksCreated: rows.length };
}

// ============================================================
// Demo Workspace Knowledge Base (3 enterprise-focused docs)
// ============================================================

const DEMO_KNOWLEDGE_BASE = [
  {
    title: 'Everlast AI Enterprise Edition',
    content: `# Everlast AI Enterprise Edition

## Überblick

Everlast AI Enterprise Edition ist die leistungsstarke Variante der Everlast AI Plattform, entwickelt für Unternehmen mit hohen Anforderungen an Skalierbarkeit, Sicherheit und individuelle Anpassung.

## Enterprise-Features

### Unbegrenzte Workspaces
Enterprise-Kunden können beliebig viele isolierte Workspaces anlegen — für Teams, Abteilungen, Kunden oder Projekte. Jeder Workspace hat eine eigene Wissensbasis, eigene Zugriffskontrollen und vollständige Datenisolierung.

### Single Sign-On (SSO)
Nahtlose Integration mit SAML 2.0-kompatiblen Identity Providern wie Okta, Azure AD, Google Workspace und Ping Identity. Mitarbeitende melden sich mit ihren bestehenden Unternehmens-Accounts an.

### Dedizierte Infrastruktur
Enterprise-Kunden erhalten dedizierte GPU-Cluster für Embedding-Berechnungen und priorisierte API-Kapazitäten, die auch unter Last stabile Antwortzeiten garantieren.

### SLA-Garantien
- **99,9 % Uptime** (monatlich gemessen)
- **< 500 ms P95-Latenz** für Abfragen bis 5.000 Tokens
- **24/7 Enterprise Support** mit garantierter Reaktionszeit < 2 Stunden

### On-Premises-Deployment
Für Branchen mit strengen Datenschutzanforderungen (Gesundheitswesen, Finanzsektor, Behörden) kann Everlast AI vollständig in der eigenen Cloud-Infrastruktur betrieben werden.

## Preise

Enterprise-Preise werden individuell vereinbart und hängen von Nutzeranzahl, Datenvolumen und gewünschten Features ab. Kontaktiere unser Sales-Team unter enterprise@everlast.ai für ein Angebot.

## Migration aus Standard- oder Pro-Plänen

Der Wechsel zu Enterprise ist jederzeit möglich. Alle bestehenden Daten, Workspaces und Konfigurationen bleiben vollständig erhalten. Das Migrations-Team begleitet den Übergang.`,
  },
  {
    title: 'Migrations-Leitfaden: Von Konkurrenzprodukten zu Everlast AI',
    content: `# Migrations-Leitfaden

## Von bestehenden RAG-Systemen zu Everlast AI wechseln

Dieser Leitfaden beschreibt, wie du bestehende Wissensdatenbanken und RAG-Systeme zu Everlast AI migrierst.

## Unterstützte Quellsysteme

Everlast AI bietet direkte Migrations-Tools für:
- **Notion**: Seiten und Datenbanken direkt importieren
- **Confluence**: Spaces und Pages per API-Import
- **SharePoint**: Dokumentbibliotheken per Bulk-Upload
- **Pinecone / Qdrant**: Vektordaten re-einbetten (Modellwechsel erforderlich)
- **LangChain VectorStores**: JSON-Export + Everlast AI Import-Script

## Schritt-für-Schritt-Anleitung

### 1. Daten exportieren
Exportiere deine bestehenden Dokumente als Plaintext oder Markdown. Formatierungen werden automatisch bereinigt.

### 2. Workspace anlegen
Lege in Everlast AI einen neuen Workspace an und wähle den passenden Plan.

### 3. Dokumente importieren
Nutze die Admin-Oberfläche oder die REST API zum Batch-Import. Das System chunked und bettet die Dokumente automatisch ein.

### 4. Qualität prüfen
Stelle Testfragen und prüfe, ob die Antworten korrekt aus den migrierten Dokumenten abgeleitet werden. Nutze die Quellenangaben, um Retrieval-Qualität zu beurteilen.

### 5. Altsystem abschalten
Erst nach erfolgreicher Validierungsphase das Quellsystem abschalten.

## Häufige Migrationsprobleme

**Problem:** Antwortqualität schlechter als erwartet.
**Lösung:** Chunk-Größe anpassen. Sehr lange Dokumente sollten in thematische Abschnitte unterteilt werden.

**Problem:** Veraltete Inhalte werden bevorzugt.
**Lösung:** Ältere Dokumentversionen löschen und nur aktuelle Versionen behalten.

**Problem:** Fachbegriffe werden nicht erkannt.
**Lösung:** Glossar-Dokument mit Definitionen und Synonymen einpflegen.

## Support

Das Migrations-Team ist erreichbar unter migration@everlast.ai und begleitet Enterprise-Kunden durch den gesamten Prozess.`,
  },
  {
    title: 'API Changelog & Release Notes',
    content: `# API Changelog & Release Notes

## Version 2.1.0 (aktuell)

### Neue Features
- **Workspace-API**: Workspaces können jetzt programmatisch über die REST API erstellt und verwaltet werden
- **Batch-Query-Endpunkt**: Bis zu 50 Fragen in einem API-Call abfragen (ideal für Evaluierungen)
- **Streaming-Metadaten**: Quellenangaben werden jetzt synchron mit dem Stream übertragen, nicht mehr als separater Request
- **Custom Embeddings**: Eigene Embedding-Modelle können als OpenAI-kompatibler Endpunkt eingebunden werden

### Verbesserungen
- Antwortlatenz um 23 % reduziert durch optimierten Retrieval-Cache
- match_threshold-Parameter jetzt in der Query-API konfigurierbar (Standard: 0.5)
- Verbesserte Fehlerbehandlung mit sprechenden Fehlercodes

### Breaking Changes
- POST /api/v1/query gibt jetzt immer "sources" als Array zurück (früher optional null)
- chunk_count in Document-Responses umbenannt zu chunks_created für Konsistenz

---

## Version 2.0.0

### Neue Features
- **Multi-Workspace-Unterstützung**: Vollständige Datenisolierung zwischen Workspaces
- **pgvector-Backend**: Migration von externem Vektordatenbank-Dienst auf Supabase pgvector
- **Streaming-Antworten**: Echtzeit-Token-Streaming für alle Chat-Endpoints
- **Source Citations**: Automatische Quellenangaben mit Ähnlichkeitsscore

### Migration von v1.x
Das Datenmodell hat sich grundlegend geändert. Alle Dokumente müssen re-eingebettet werden. Ein automatisches Migrations-Script ist unter scripts/migrate-v1.ts verfügbar.

---

## Version 1.5.2

### Bugfixes
- Chunk-Overlap-Berechnung für sehr kurze Dokumente korrigiert
- Race Condition beim parallelen Einbetten mehrerer Dokumente behoben
- Timeouts bei großen Dokumenten (>50k Tokens) erhöht

---

## Deprecation-Hinweise

- POST /api/v1/ingest/bulk wird mit v3.0 entfernt → Ersatz: POST /api/v2/documents/batch
- GET /api/v1/search (synchron) wird mit v3.0 entfernt → Ersatz: Streaming-Endpoint nutzen

Fragen zum Changelog: developers@everlast.ai`,
  },
];

// ============================================================
// KI Wissensbasis (10 umfangreiche Dokumente zur Künstlichen Intelligenz)
// ============================================================

const KI_KNOWLEDGE_BASE = [
  {
    title: 'Was ist Künstliche Intelligenz?',
    content: `Künstliche Intelligenz (KI) bezeichnet die Fähigkeit von Maschinen, Aufgaben auszuführen, die normalerweise menschliche Intelligenz erfordern — darunter Wahrnehmung, Sprachverständnis, Lernen, Problemlösung und Entscheidungsfindung. Der Begriff wurde 1956 von John McCarthy geprägt, als er die erste akademische Konferenz zu diesem Thema an der Dartmouth University organisierte.

Die Geschichte der KI lässt sich in mehrere Phasen einteilen. Die ersten Jahrzehnte (1950er bis 1970er) waren geprägt von Optimismus und symbolischen Ansätzen: Forscher glaubten, dass Intelligenz vollständig durch explizite Regeln und logische Schlussfolgerungen modelliert werden könnte. Systeme wie ELIZA (1966) simulierten einfache Konversationen, und der GPS (General Problem Solver) sollte universelle Problemlösungsstrategien implementieren.

In den 1980er Jahren erlebten Expertensysteme einen Boom. Diese regelbasierten Systeme kodierten das Fachwissen menschlicher Experten in umfangreiche if-then-Regelwerke. Sie wurden erfolgreich in der Medizindiagnostik (MYCIN), der geologischen Erkundung (PROSPECTOR) und dem Bankwesen eingesetzt. Allerdings stießen sie schnell an Grenzen: Das Aktualisieren der Regeln war aufwendig, und die Systeme konnten nicht mit Unsicherheit umgehen oder aus Erfahrung lernen.

Der erste "KI-Winter" in den frühen 1970ern und ein zweiter in den späten 1980ern waren Perioden, in denen Fördermittel und öffentliches Interesse einbrachen, weil die hochgesteckten Erwartungen nicht erfüllt wurden. Diese Phasen waren jedoch produktiv für die Grundlagenforschung.

Der Durchbruch kam mit dem maschinellen Lernen in den 1990ern und 2000ern. Statt explizite Regeln zu programmieren, lernten Algorithmen Muster aus Daten. Support Vector Machines, Entscheidungsbäume und Ensemblemethoden wie Random Forests erzielten beeindruckende Ergebnisse. Die Verfügbarkeit großer Datensätze und gestiegene Rechenleistung befeuerten den Fortschritt.

Den eigentlichen Paradigmenwechsel brachte das Deep Learning ab 2012. Als AlexNet, ein tiefes neuronales Netz, den ImageNet-Wettbewerb für Bilderkennung gewann, wurde klar, dass mehrschichtige neuronale Netze mit ausreichend Daten und GPU-Rechenleistung herausragende Leistungen erzielen können. Seitdem hat Deep Learning praktisch alle Bereiche der KI revolutioniert.

Heute unterscheiden Forscher zwischen schwacher KI (Narrow AI) und allgemeiner KI (Artificial General Intelligence, AGI). Schwache KI ist für spezifische Aufgaben optimiert — Schach spielen, Bilder erkennen, Sprache übersetzen — und übertrifft Menschen oft bei diesen eng definierten Aufgaben. AGI hingegen würde menschenähnliche Flexibilität und Anpassungsfähigkeit über alle Domänen hinweg besitzen. AGI gilt noch als nicht erreicht; die meisten heutigen Systeme sind hochspezialisierte schwache KI.

Teilgebiete der KI umfassen maschinelles Lernen, Deep Learning, natürliche Sprachverarbeitung, Computer Vision, Robotik, Wissensrepräsentation, Expertensysteme, Planungssysteme und Multiagentensysteme. Jedes dieser Felder hat eigene Methoden, Herausforderungen und Anwendungen.

Die gesellschaftliche Bedeutung der KI wächst rasant. Prognosen des Weltwirtschaftsforums schätzen, dass KI bis 2030 zwischen 70 und 170 Billionen US-Dollar zum globalen BIP beitragen könnte. Gleichzeitig entstehen tiefgreifende Fragen zu Arbeit, Datenschutz, Verantwortung und menschlicher Würde, die interdisziplinäre Zusammenarbeit zwischen Informatik, Philosophie, Recht, Ethik und Sozialwissenschaften erfordern.`,
  },
  {
    title: 'Machine Learning — Grundlagen und Methoden',
    content: `Maschinelles Lernen (Machine Learning, ML) ist ein Teilgebiet der Künstlichen Intelligenz, das Systeme befähigt, aus Daten zu lernen und ihre Leistung zu verbessern, ohne explizit für jede Aufgabe programmiert zu werden. Der Begriff wurde 1959 von Arthur Samuel geprägt, der ihn in Zusammenhang mit einem selbstlernenden Damespiel-Programm verwendete.

Das fundamentale Prinzip des maschinellen Lernens ist die Approximation einer unbekannten Funktion durch Beispieldaten. Gegeben eine Eingabe x und eine gewünschte Ausgabe y, sucht der Algorithmus eine Funktion f, sodass f(x) ≈ y für möglichst viele Beispiele gilt. Die Art, wie Beispiele bereitgestellt werden und welche Rückmeldung der Algorithmus erhält, definiert die drei Hauptparadigmen des ML.

Überwachtes Lernen (Supervised Learning) ist das verbreitetste Paradigma. Der Algorithmus erhält gelabelte Trainingsdaten — Paare aus Eingabe und korrekter Ausgabe. Er lernt, die Eingaben den Ausgaben zuzuordnen und verallgemeinert auf neue, ungesehene Daten. Klassifikation (Kategorie vorhersagen) und Regression (kontinuierlichen Wert vorhersagen) sind die zwei Hauptaufgaben. Beispiele: Spam-Erkennung, Kreditrisikobewertung, Bilderkennung, Sprachübersetzung.

Wichtige Algorithmen für überwachtes Lernen umfassen lineare und logistische Regression (einfach, interpretierbar), Entscheidungsbäume (intuitiv, neigt zu Überanpassung), Random Forests (Ensemble aus Bäumen, robust), Gradient Boosting (XGBoost, LightGBM — häufig bei strukturierten Daten gewinnend), Support Vector Machines (effektiv bei kleinen Datensätzen, klarer Entscheidungsgrenze) und neuronale Netze (universell einsetzbar, skalierbar).

Unüberwachtes Lernen (Unsupervised Learning) arbeitet ohne Labels. Der Algorithmus findet selbstständig Strukturen, Muster oder Gruppen in den Daten. Clustering-Algorithmen wie K-Means, DBSCAN oder hierarchisches Clustering teilen Datenpunkte in ähnliche Gruppen ein. Dimensionsreduktion (PCA, t-SNE, UMAP) komprimiert hochdimensionale Daten in niedrigdimensionale Darstellungen, die visualisierbar sind. Anomalieerkennung identifiziert ungewöhnliche Datenpunkte, die von der Norm abweichen. Anwendungen: Kundensegmentierung, Empfehlungssysteme, Betrugserkennung.

Bestärkendes Lernen (Reinforcement Learning) ist von der Psychologie des Verhaltens inspiriert. Ein Agent interagiert mit einer Umgebung, führt Aktionen aus und erhält Belohnungen oder Strafen. Ziel ist es, eine Strategie (Policy) zu erlernen, die die langfristige kumulative Belohnung maximiert. Dieses Paradigma hat spektakuläre Erfolge erzielt: DeepMinds AlphaGo und AlphaZero bezwangen menschliche Weltmeister im Go-Spiel; OpenAIs GPT-Modelle wurden mit RLHF (Reinforcement Learning from Human Feedback) auf menschliche Präferenzen ausgerichtet.

Ein zentrales Problem im ML ist die Balance zwischen Bias und Varianz. Bias (Verzerrung) entsteht, wenn ein Modell zu simpel ist und wichtige Muster verfehlt (Underfitting). Varianz tritt auf, wenn ein Modell zu komplex ist und Zufälligkeiten im Training statt echter Muster lernt (Overfitting). Regularisierungstechniken wie L1 (Lasso), L2 (Ridge), Dropout und Early Stopping helfen, Overfitting zu vermeiden.

Die Evaluation von ML-Modellen erfordert geeignete Metriken. Für Klassifikation: Genauigkeit (Accuracy), Präzision, Recall, F1-Score, AUC-ROC. Für Regression: Mean Absolute Error (MAE), Mean Squared Error (MSE), R². Kreuzvalidierung (Cross-Validation) stellt sicher, dass Ergebnisse nicht zufällig sind.

Feature Engineering — die Auswahl und Transformation relevanter Eingabevariablen — hat historisch einen großen Einfluss auf die Modellleistung. Mit Deep Learning hat sich dieser Prozess teilweise automatisiert: Neuronale Netze extrahieren relevante Features selbst aus Rohdaten.

Skalierung und Normalisierung der Daten sind oft entscheidend. Algorithmen wie lineare Regression und neuronale Netze reagieren empfindlich auf unterschiedliche Wertebereiche; Standardisierung (Z-Score) oder Min-Max-Normalisierung sind gängige Vorverarbeitungsschritte.

Klassen-Imbalanz ist ein häufiges Problem in der Praxis: Wenn eine Klasse (z.B. Betrugsfälle) nur einen kleinen Bruchteil der Daten ausmacht, neigen Modelle dazu, sie zu ignorieren. Techniken wie SMOTE (Synthetic Minority Over-sampling), Klassengewichtung und Ensemble-Methoden adressieren dieses Problem.

AutoML (Automated Machine Learning) automatisiert die Auswahl von Algorithmen, Hyperparameter-Optimierung und Feature Engineering. Tools wie Google AutoML, H2O.ai und Auto-sklearn ermöglichen es, auch ohne tiefes ML-Wissen gute Modelle zu erstellen. Sie demokratisieren ML, können aber auch zu einem Black-Box-Problem führen, wenn die Interpretierbarkeit verloren geht.`,
  },
  {
    title: 'Deep Learning und neuronale Netze',
    content: `Deep Learning ist ein Teilbereich des maschinellen Lernens, der auf künstlichen neuronalen Netzen mit vielen Schichten basiert. Der Begriff "deep" bezieht sich auf die Tiefe des Netzes — die Anzahl der Schichten zwischen Eingabe und Ausgabe. Deep Learning hat in den letzten zehn Jahren eine Revolution in der KI ausgelöst und Ergebnisse ermöglicht, die mit traditionellen Methoden nicht erreichbar waren.

Das biologische Vorbild ist das Gehirn: Milliarden von Neuronen, die durch Synapsen verbunden sind, verarbeiten Informationen parallel. Künstliche neuronale Netze abstrahieren dieses Prinzip: Knoten (Neuronen) sind in Schichten angeordnet, und gewichtete Verbindungen (Kanten) übertragen Signale. Die Stärke der Verbindungen — die Gewichte — werden während des Lernens angepasst.

Die grundlegende Einheit ist das Perceptron: Es berechnet eine gewichtete Summe seiner Eingaben, addiert einen Bias-Term und wendet eine Aktivierungsfunktion an. Die Ausgabe wird zur Eingabe der nächsten Schicht. Mehrere Schichten ergeben ein Multi-Layer Perceptron (MLP) oder vollständig verbundenes Netz (Fully Connected Network).

Aktivierungsfunktionen bestimmen, wie ein Neuron seine Eingabe in eine Ausgabe umwandelt. Sigmoid (σ(x) = 1/(1+e^{-x})) quetscht Werte auf [0,1], hat aber das "vanishing gradient" Problem bei tiefen Netzen. Tanh (tanh(x)) liefert Ausgaben in [-1,1] und zentriert die Daten besser. ReLU (Rectified Linear Unit, max(0,x)) ist heute die am häufigsten verwendete Aktivierungsfunktion — sie ist einfach zu berechnen, löst das Gradient-Problem größtenteils und beschleunigt das Training. Varianten wie Leaky ReLU, ELU und GELU wurden entwickelt, um die "dying ReLU"-Schwäche zu adressieren.

Training erfolgt durch Backpropagation und Gradientenabstieg. Backpropagation berechnet, wie sehr jedes Gewicht zum Fehler beigetragen hat (Gradient des Verlusts nach dem Gewicht). Der Gradientenabstieg passt Gewichte in Richtung des negativen Gradienten an, um den Verlust zu minimieren. Stochastic Gradient Descent (SGD) und seine Varianten (Adam, RMSProp, AdaGrad) sind die dominierenden Optimierungsalgorithmen. Adam (Adaptive Moment Estimation) kombiniert Momentum und adaptive Lernraten und konvergiert in der Praxis oft schneller als reines SGD.

Convolutional Neural Networks (CNNs) sind speziell für Bilddaten optimiert. Statt vollständiger Verbindungen nutzen sie Faltungsoperationen, die lokale Muster im Bild erkennen. Eine Faltungsschicht (Convolutional Layer) enthält lernbare Filter, die über das Bild geschoben werden und Features wie Kanten, Texturen oder Formen extrahieren. Pooling-Schichten reduzieren die räumliche Auflösung und machen das Netz translationsinvariant. Berühmte CNN-Architekturen: AlexNet (2012, Durchbruch ImageNet), VGGNet (sehr tiefe, einfache Architektur), ResNet (Residualverbindungen gegen vanishing gradients, bis zu 152 Schichten), EfficientNet (skalierbare Architektur).

Recurrent Neural Networks (RNNs) verarbeiten sequenzielle Daten, indem sie einen versteckten Zustand (Hidden State) durch die Zeitschritte transportieren. Sie eignen sich für Zeitreihen, Text und Audio. Long Short-Term Memory (LSTM) Netze und Gated Recurrent Units (GRUs) adressieren das Problem von RNNs, langfristige Abhängigkeiten zu lernen (vanishing/exploding gradients). LSTMs haben Gating-Mechanismen, die kontrollieren, welche Information behalten, vergessen oder ausgegeben wird.

Transformer (2017, "Attention is All You Need" von Vaswani et al.) revolutionierten natürliche Sprachverarbeitung und andere Bereiche. Statt Rekurrenz nutzen Transformer Self-Attention, um Beziehungen zwischen allen Positionen in einer Sequenz gleichzeitig zu modellieren. Das ermöglicht paralleles Training (im Gegensatz zu RNNs) und das Erfassen sehr langer Abhängigkeiten. BERT, GPT, T5 und LLaMA sind bekannte Transformer-Architekturen. Heute werden Transformer auch außerhalb von NLP eingesetzt: Vision Transformer (ViT) für Bilder, Audio-Transformer für Sprache.

Generative Adversarial Networks (GANs) bestehen aus zwei Netzen — Generator und Diskriminator —, die gegeneinander trainieren. Der Generator erzeugt künstliche Daten; der Diskriminator versucht, echte von künstlichen Daten zu unterscheiden. Das Training ist ein Minimax-Spiel. GANs haben beeindruckende Ergebnisse bei der Bilderzeugung geliefert (StyleGAN, DALL-E-Vorgänger). Varianten: Conditional GAN, CycleGAN, Progressive GAN.

Diffusionsmodelle (Diffusion Models) sind der aktuelle Stand der Technik für generative Bildmodelle. Sie lernen, aus Rauschen schrittweise ein klares Bild zu rekonstruieren (denoising). Stable Diffusion, DALL-E 2/3 und Midjourney basieren auf diesem Prinzip. Diffusionsmodelle sind oft stabiler zu trainieren als GANs und liefern diversere Ausgaben.

Regularisierungstechniken in tiefen Netzen: Dropout (zufälliges Deaktivieren von Neuronen während des Trainings), Batch Normalization (Normalisierung der Aktivierungen zwischen Schichten, stabilisiert Training), Data Augmentation (zufällige Transformationen der Trainingsdaten), Weight Decay (L2-Regularisierung auf Gewichte), Early Stopping (Training beenden, wenn Validierungsfehler steigt).

Transfer Learning hat Deep Learning demokratisiert: Vortrainierte Modelle auf großen Datensätzen (ImageNet, Wikipedia-Text) werden auf spezifische Aufgaben feinabgestimmt (Fine-Tuning). Dadurch sind gute Ergebnisse auch mit wenig domänenspezifischen Daten möglich. Foundation Models wie BERT, GPT-4 und CLIP können mit wenig Anpassung auf hunderte verschiedene Aufgaben angewendet werden.`,
  },
  {
    title: 'Natural Language Processing (NLP)',
    content: `Natural Language Processing (NLP), auf Deutsch natürliche Sprachverarbeitung, ist ein Teilgebiet der KI, das sich mit der Interaktion zwischen Computern und menschlicher Sprache beschäftigt. Ziel ist es, Computer zu befähigen, menschliche Sprache zu verstehen, zu interpretieren, zu generieren und darauf zu reagieren.

Sprache ist eines der komplexesten Phänomene, die Computer bewältigen müssen. Sie ist mehrdeutig (Ein Wort, viele Bedeutungen), kontextabhängig, kulturell geprägt und ständig im Wandel. NLP verbindet Linguistik, Informatik, Statistik und kognitive Wissenschaften.

Grundlegende NLP-Aufgaben umfassen: Tokenisierung (Text in Wörter oder Satzteile zerlegen), Part-of-Speech Tagging (Wortarten erkennen), Named Entity Recognition (Eigennamen, Orte, Organisationen identifizieren), syntaktisches Parsing (Satzstruktur analysieren), semantische Analyse (Bedeutung verstehen), Sentiment-Analyse (Meinung/Stimmung erkennen), maschinelle Übersetzung, Textzusammenfassung, Frage-Antwort-Systeme und Textgenerierung.

Historisch wurde NLP durch regelbasierte Systeme dominiert. Handgeschriebene Grammatiken und lexikalische Ressourcen (WordNet, FrameNet) wurden genutzt, um Sprache zu verarbeiten. Diese Systeme waren präzise für klar definierte Domänen, skalieren aber schlecht.

Die statistische Wende in den 1990ern brachte maschinelle Lernmethoden ins NLP. N-Gram-Modelle modellierten die Wahrscheinlichkeit von Wortfolgen. Hidden Markov Models wurden für Part-of-Speech Tagging eingesetzt. Maximale Entropie und Conditional Random Fields folgten. Leistung verbesserte sich, aber die Verarbeitung tieferer Bedeutung blieb schwierig.

Word Embeddings, eingeführt mit Word2Vec (2013, Google, Mikolov et al.), veränderten NLP grundlegend. Wörter werden als dichte Vektoren in einem hochdimensionalen Raum dargestellt, wobei semantisch ähnliche Wörter nahe beieinander liegen. Faszinierendes Ergebnis: König - Mann + Frau ≈ Königin. GloVe und FastText sind verwandte Methoden. Embeddings kodieren syntaktische und semantische Beziehungen und ermöglichen Transfer Learning.

BERT (Bidirectional Encoder Representations from Transformers, 2018, Google) war ein Meilenstein. BERT nutzt den Transformer-Encoder und wird bidirektional trainiert — es berücksichtigt Kontext von links und rechts. Zwei Vortrainierungsziele: Masked Language Modeling (zufällig maskierte Wörter vorhersagen) und Next Sentence Prediction. BERT-Feinabstimmung auf spezifische Aufgaben (Klassifikation, NER, Frage-Antwort) erzielte State-of-the-Art-Ergebnisse auf zahlreichen Benchmarks.

GPT (Generative Pre-trained Transformer, OpenAI) ist ein autoregressives Sprachmodell: Es wird darauf trainiert, das nächste Wort vorherzusagen, linksläufig. GPT-1 (2018), GPT-2 (2019, zunächst zurückgehalten aus Missbrauchssorgen), GPT-3 (2020, 175 Milliarden Parameter) und GPT-4 (2023) zeigten, dass skalierte Transformer emergente Fähigkeiten entwickeln, die bei der Entwicklung nicht explizit trainiert wurden.

Tokenisierung im modernen NLP: Statt auf Wortebene arbeiten viele Modelle mit Subword-Tokens (BPE, SentencePiece, WordPiece). Dies löst das Problem unbekannter Wörter und handhabt agglutinierende Sprachen wie Türkisch oder Deutsch besser. GPT-4 nutzt rund 100.000 verschiedene Tokens.

Attention-Mechanismus: Das Herzstück moderner NLP. Self-Attention berechnet für jedes Token in einer Sequenz, wie relevant alle anderen Token dafür sind (Query-Key-Value-Schema). Multi-Head Attention führt diesen Prozess parallel für verschiedene "Aspekte" durch. Positional Encoding fügt Informationen über die Position der Tokens in der Sequenz hinzu, da Transformer ohne rekurrente Struktur keine inhärente Positionsinformation haben.

Anwendungen von NLP in der Praxis: Maschinelle Übersetzung (Google Translate, DeepL), Chatbots und virtuelle Assistenten (Alexa, Siri, ChatGPT), automatische Textzusammenfassung (Artikel kürzen, Meeting-Protokolle), Sentiment-Analyse (Social-Media-Monitoring, Produktrezensionen), Informationsextraktion (Fakten aus Texten strukturieren), Rechtsdokumentenanalyse, medizinische Textanalyse (ICD-Kodierung aus Arztbriefen), Programmiercode-Generierung (GitHub Copilot, Claude Code).

Herausforderungen in NLP: Mehrdeutigkeit (Polysemie, syntaktische Ambiguität), Weltwissen und Common Sense Reasoning (Sprachmodelle lernen statistische Muster, kein echtes Verstehen), Halluzination (Modelle generieren plausibel klingende, aber falsche Aussagen), sprachliche Diversität (viele Sprachen sind unterrepräsentiert in Trainingsdaten), Toxizität und Vorurteile in generierten Texten, Datenschutz bei der Verarbeitung sensibler Texte.

Evaluation in NLP: BLEU-Score für maschinelle Übersetzung, ROUGE für Zusammenfassung, Perplexity für Sprachmodelle, F1 für NER und Frage-Antwort. Menschliche Evaluation bleibt oft der Goldstandard für generative Aufgaben, ist aber teuer und subjektiv.`,
  },
  {
    title: 'Computer Vision — Bildverstehen mit KI',
    content: `Computer Vision (CV) ist das Gebiet der KI, das sich damit beschäftigt, Computer zu befähigen, digitale Bilder und Videos zu verstehen und zu interpretieren — ähnlich wie das menschliche visuelle System. CV kombiniert Signalverarbeitung, Mustererkennung, maschinelles Lernen und 3D-Geometrie.

Das menschliche visuelle System ist beeindruckend effizient: Menschen erkennen Objekte in Millisekunden, auch unter wechselnden Lichtverhältnissen, Perspektiven und Verdeckungen. Computer Vision versucht, diese Fähigkeiten zu replizieren und in vielen Bereichen zu übertreffen.

Grundlegende Aufgaben in CV: Bildklassifikation (Welches Objekt ist auf dem Bild?), Objekterkennung (Wo sind Objekte, welche Klassen haben sie? — Bounding Boxes), semantische Segmentierung (Jedes Pixel einem Klassen-Label zuordnen), Instanz-Segmentierung (Einzelne Instanzen voneinander unterscheiden), Tiefenschätzung (3D-Tiefe aus 2D-Bild), optischer Fluss (Bewegung zwischen Frames schätzen), Posenschätzung (Körperposen erkennen), Gesichtserkennung.

Die Geschichte der CV beginnt lange vor dem Deep-Learning-Zeitalter. In den 1970er und 1980ern dominierten handgefertigte Feature-Extraktoren: SIFT (Scale-Invariant Feature Transform), HOG (Histogram of Oriented Gradients) und Haar-Cascades. Diese extrahierten robuste lokale Features aus Bildern, die dann mit klassischen Klassifikatoren (SVMs) verwendet wurden. Das Viola-Jones-Verfahren (2001) ermöglichte Echtzeit-Gesichtsdetektion.

Die Revolution: 2012 gewann AlexNet den ImageNet Large Scale Visual Recognition Challenge (ILSVRC) mit einem Top-5-Fehler von 15,3% — mehr als 10 Prozentpunkte besser als der Zweitplatzierte. AlexNet war ein tiefes CNN mit 60 Millionen Parametern, trainiert auf zwei GPUs. Dieses Ereignis gilt als Startschuss des modernen Deep-Learning-Zeitalters.

CNN-Architekturen entwickelten sich rasant: VGGNet (Oxford, 2014) zeigte, dass tiefere Netze mit kleinen 3x3-Filtern leistungsstärker sind. GoogLeNet/Inception (2014) führte Inception-Module ein, die parallel verschiedene Filtergrößen nutzen, um Recheneffizienz und Ausdruckskraft zu erhöhen. ResNet (Microsoft, 2015) löste das Problem des verschwindenden Gradienten mit Skip Connections (Residualverbindungen): Einige Schichten lernen Residuen statt direkter Abbildungen. ResNet mit 152 Schichten gewann ILSVRC 2015. DenseNet verbindet jede Schicht mit allen vorhergegangenen Schichten.

Für mobile Anwendungen wurden effiziente Architekturen entwickelt: MobileNet nutzt depthwise separable Convolutions, die deutlich weniger Berechnungen erfordern. EfficientNet skaliert Breite, Tiefe und Auflösung des Netzes gleichzeitig nach einer compound scaling formula.

Objekterkennung: Frühe Ansätze wie R-CNN (Region-based CNN) verwendeten Selective Search, um Kandidatenregionen zu finden, und klassifizierten diese dann einzeln — zu langsam für Echtzeit. Fast R-CNN und Faster R-CNN verbesserten die Geschwindigkeit erheblich. YOLO (You Only Look Once) ist ein Single-Stage-Detektor, der Erkennung als direktes Regressionsproblem formuliert und Echtzeit-Erkennung ermöglicht. YOLO v8 ist heute eine der beliebtesten Implementierungen.

Semantische Segmentierung: Fully Convolutional Networks (FCN) ersetzten die vollständig verbundenen Schichten durch Faltungsschichten, um pixelweise Vorhersagen zu ermöglichen. U-Net (besonders in der Medizin eingesetzt) verwendet eine Encoder-Decoder-Struktur mit Skip Connections für präzise Segmentierung bei wenig Trainingsdaten.

Vision Transformer (ViT, 2020) übertragen das Transformer-Konzept auf Bilder: Das Bild wird in Patches aufgeteilt, und jeder Patch wird wie ein Token in einem Satz behandelt. ViT übertrifft CNNs auf großen Datensätzen, benötigt aber mehr Daten für das Training. DINO und MAE (Masked Autoencoder) sind selbstüberwachte Vortrainierungsmethoden für ViTs.

Generative Computer Vision: GANs (Generative Adversarial Networks) haben beeindruckende Ergebnisse bei der Bilderzeugung erzielt — StyleGAN kann täuschend echte Gesichter erzeugen. Diffusionsmodelle (Stable Diffusion, DALL-E, Midjourney, Imagen) erzeugen qualitativ hochwertige Bilder aus Textbeschreibungen und stellen den aktuellen Stand der Technik dar.

Anwendungen: Autonomes Fahren (Erkennung von Verkehrsteilnehmern, Spurmarkierungen, Ampeln), medizinische Bildgebung (Tumorerkennung in MRT/CT, Diabetische Retinopathie aus Fundusfotos), industrielle Qualitätskontrolle (Defekterkennung), Gesichtserkennung (Sicherheitssysteme, Entsperren von Geräten), Augmented Reality, Satellitenbildanalyse (Landnutzung, Katastrophenerkennung), sportliche Leistungsanalyse.

Herausforderungen: Robustheit gegenüber adversariellen Angriffen (kleine, für Menschen unsichtbare Störungen können CVNs täuschen), Verallgemeinerung bei Domänenverschiebung (Unterschied zwischen Trainings- und Testdaten), Erklärbarkeit (warum klassifiziert das Netz so?), Datenschutz bei Gesichtserkennung, Fairness (verschiedene demographische Gruppen oft ungleich gut erkannt).`,
  },
  {
    title: 'Reinforcement Learning — Lernen durch Interaktion',
    content: `Reinforcement Learning (RL) ist ein Paradigma des maschinellen Lernens, bei dem ein Agent durch Interaktion mit einer Umgebung lernt, optimale Entscheidungen zu treffen. Anders als beim überwachten Lernen gibt es keine gelabelten Beispiele; der Agent erhält lediglich Belohnungen oder Strafen für seine Aktionen und soll eine Strategie erlernen, die die langfristige kumulative Belohnung maximiert.

Das Konzept ist inspiriert von der Verhaltenspsychologie: Burrhus Frederic Skinners Operante Konditionierung beschreibt, wie Tiere durch Belohnungen und Strafen Verhaltensweisen erlernen. RL formalisiert dieses Prinzip mathematisch.

Grundlegende Komponenten des RL: Der Agent trifft Entscheidungen. Die Umgebung (Environment) ist die Welt, in der der Agent agiert. Ein Zustand (State) beschreibt die aktuelle Situation. Eine Aktion (Action) ist eine Entscheidung des Agenten. Eine Belohnung (Reward) ist ein skalares Signal, das bewertet, wie gut eine Aktion im aktuellen Zustand war. Die Policy (Strategie) π(a|s) bestimmt, welche Aktion der Agent in einem Zustand wählt. Die Value Function V(s) schätzt die langfristige erwartete Belohnung ab einem Zustand. Die Q-Function Q(s,a) schätzt die langfristige erwartete Belohnung, wenn im Zustand s die Aktion a ausgeführt wird.

Das Markov Decision Process (MDP) ist der mathematische Rahmen für RL. Die Markov-Eigenschaft besagt, dass der nächste Zustand nur vom aktuellen Zustand (nicht der History) abhängt. Nicht alle realen Probleme erfüllen diese Eigenschaft strikt, aber das MDP-Framework ist trotzdem sehr nützlich.

Der Exploration-Exploitation-Tradeoff ist ein fundamentales Problem: Der Agent muss bekannte Strategien ausnutzen (Exploitation), um Belohnungen zu sammeln, und gleichzeitig Neues erkunden (Exploration), um bessere Strategien zu entdecken. Epsilon-Greedy-Strategien wählen mit Wahrscheinlichkeit ε eine zufällige Aktion (Exploration) und mit Wahrscheinlichkeit 1-ε die beste bekannte Aktion (Exploitation). Upper Confidence Bound (UCB) und Thompson Sampling sind anspruchsvollere Methoden.

Q-Learning ist ein modellfreier RL-Algorithmus, der die Q-Funktion iterativ verbessert, ohne ein Modell der Umgebung zu benötigen. Der Bellman-Gleichung folgend wird die Q-Funktion mit jedem beobachteten Übergang aktualisiert. Q-Learning konvergiert bei diskreten Zustand- und Aktionsräumen zu der optimalen Q-Funktion.

Deep Q-Network (DQN, DeepMind 2013) kombinierte Q-Learning mit neuronalen Netzen, um den Zustandsraum zu approximieren. DQN lernte, Atari-Spiele direkt aus dem Rohbild zu spielen und übertraf in vielen Spielen menschliche Leistung. Technische Neuerungen: Experience Replay (zufällige Auswahl vergangener Erfahrungen für Training), Target Network (separates Netz für stabile Q-Targets).

Policy Gradient Methoden optimieren direkt die Policy, statt die Value Function zu approximieren. REINFORCE, A2C (Advantage Actor Critic) und A3C (Asynchronous Advantage Actor Critic) sind bekannte Methoden. Proximal Policy Optimization (PPO) ist robust und einfach zu implementieren; es ist die Basis für das Training vieler moderner LLMs mit RLHF.

Model-based RL lernt ein Modell der Umgebung (Übergangswahrscheinlichkeiten und Belohnungen) und nutzt es für Planung. Dies kann Dateneffizienz erhöhen, ist aber schwieriger zu implementieren. World Models (David Ha, Jürgen Schmidhuber) und Dreamer sind interessante Ansätze.

Spektakuläre Erfolge des RL: AlphaGo (DeepMind, 2016) bezwang Lee Sedol, Weltmeister im Go-Spiel, das als unlösbar für KI galt. AlphaGo Zero (2017) lernte Go ausschließlich durch Selbstspiel, ohne menschliches Expertenwissen. AlphaZero verallgemeinerte dies auf Schach und Shogi. OpenAI Five bezwang die weltbesten Dota2-Spieler. OpenAI Rubik's Cube Hand löste einen Rubik's Cube mit einer robotischen Hand.

Herausforderungen: Sparse Rewards (Belohnung selten, erschwert das Lernen), Sample Inefficiency (RL benötigt oft Millionen von Interaktionen), Reward Hacking (Agent findet unerwartete Wege, die Belohnungsfunktion zu maximieren, ohne das eigentliche Ziel zu erfüllen), Generalisierung auf neue Umgebungen, Sicherheit (sicherstellen, dass der Agent keine gefährlichen Aktionen während des Lernens ausführt).

Inverse RL (IRL) lernt die Belohnungsfunktion aus beobachtetem Expertenverhalten. Anstatt die Belohnungsfunktion manuell zu designen, lernt IRL, was das implizite Ziel des Experten ist. Dies ist besonders für Imitation Learning und das Alignment-Problem relevant.

RL in der Praxis: Robotik (Greifbewegungen, Laufen), Dialog-Systeme (Chatbots, die auf Nutzerfeedback reagieren), Empfehlungssysteme (Personalisierung im Zeitverlauf), Ressourcenmanagement in Rechenzentren (DeepMind reduzierte Google-Rechenzentrums-Kühlungsenergie um 40%), algorithmisches Trading, Spieleentwicklung.`,
  },
  {
    title: 'Große Sprachmodelle (LLMs) und moderne KI-Systeme',
    content: `Große Sprachmodelle (Large Language Models, LLMs) sind Transformer-basierte neuronale Netze mit Milliarden von Parametern, die auf riesigen Textmengen vortrainiert wurden. Sie haben die KI-Landschaft seit 2020 grundlegend verändert und ermöglichen eine Vielzahl von Sprachaufgaben mit einem einzigen Modell.

Die Skalierungsgesetze (Scaling Laws, Kaplan et al., OpenAI 2020) beschreiben, wie die Leistung von Sprachmodellen mit der Modellgröße (Parameter), der Datenmenge und dem Rechenaufwand zusammenhängt — als Potenzgesetz. Diese Erkenntnis motivierte das Training immer größerer Modelle. GPT-3 (175B Parameter), PaLM (540B), Megatron-Turing NLG (530B), Chinchilla (70B, aber optimaler Datensatz/Parameter-Balance) und GPT-4 (geschätzt ~1 Billion Parameter in einer Mixture-of-Experts-Architektur) sind wichtige Meilensteine.

Emergente Fähigkeiten (Emergent Abilities) sind Fähigkeiten, die erst bei bestimmten Modellgrößen auftreten und bei kleineren Modellen völlig fehlen. Beispiele: In-Context Learning (wenige Beispiele im Prompt genügen, um eine neue Aufgabe zu lösen), Chain-of-Thought Reasoning (schrittweises Denken durch Prompting), Mehrsprachigkeit, Code-Generierung, mathematisches Reasoning. Diese Eigenschaften waren schwer vorherzusagen und überraschten auch die Forscher.

Das Vortraining (Pre-training) von LLMs erfolgt auf riesigen Textmengen (das Web, Bücher, Code, wissenschaftliche Artikel). Das Trainingsziel ist Autoregression: Vorhersage des nächsten Tokens. Durch diesen scheinbar einfachen Prozess auf Billionen von Tokens lernen Modelle erstaunlich breite Weltkenntnisse und sprachliche Fähigkeiten.

RLHF (Reinforcement Learning from Human Feedback) macht aus einem rohen Sprachmodell einen hilfreichen Assistenten. Zuerst wird ein Belohnungsmodell auf menschlichem Feedback trainiert (welche Antwort ist besser?). Dann wird das LLM mit PPO (Proximal Policy Optimization) auf dieses Belohnungsmodell feinabgestimmt. Alternativ: Direct Preference Optimization (DPO), das RLHF vereinfacht. RLHF ist der Schlüssel zum Erfolg von ChatGPT, Claude und ähnlichen Assistenten.

Prompt Engineering ist die Kunst, Eingaben so zu formulieren, dass LLMs optimale Ausgaben erzeugen. Zero-Shot-Prompting (direkte Aufgabe ohne Beispiele), Few-Shot-Prompting (einige Beispiele im Kontext), Chain-of-Thought-Prompting (das Modell auffordern, Schritt für Schritt zu denken), Selbstkonsistenz (mehrere Denkpfade generieren und abstimmen), Role-Prompting (Modell eine Rolle zuweisen) sind gängige Techniken.

Retrieval-Augmented Generation (RAG) kombiniert LLMs mit einer Wissensdatenbank. Statt alles im Modell zu speichern, werden relevante Dokumente bei jeder Anfrage abgerufen und dem Modell als Kontext mitgegeben. Vorteile: aktuelles Wissen, Quellenangaben, reduzierte Halluzinationen, Datenkontrolle. RAG ist die Architektur, auf der Everlast AI basiert.

Halluzination ist ein fundamentales Problem von LLMs: Modelle generieren plausibel klingende, aber falsche oder erfundene Aussagen. Ursachen: statistische Mustererkennung statt echten Verstehens, Überanpassung an den Trainingsstil, unzureichendes "Wissen" über die Grenzen des eigenen Wissens. Lösungsansätze: RAG, Citation-basierte Generierung, Selbstreflexion (das Modell seine Ausgaben prüfen lassen), Unsicherheitsquantifizierung.

Kontextfenster (Context Window) begrenzt, wie viel Text ein LLM gleichzeitig verarbeiten kann. Frühe GPT-Modelle hatten 2048 Tokens; aktuelle Modelle (Claude 3, GPT-4 Turbo) haben 128K oder mehr Tokens. Sehr lange Kontexte ermöglichen die Verarbeitung ganzer Codebases, Bücher oder Gespräche, stellen aber Herausforderungen an Aufmerksamkeit (Lost in the Middle-Problem) und Recheneffizienz.

Fine-Tuning passt ein vortrainiertes LLM auf spezifische Aufgaben oder Domänen an. Instruction Fine-Tuning (auf Anweisungs-Antwort-Paaren) verbessert die Ausführung von Aufgaben. Domain Fine-Tuning (auf fachspezifischen Texten) verbessert domänenspezifisches Wissen. Parameter-Efficient Fine-Tuning (LoRA, Adapter, Prefix Tuning) ermöglicht Fine-Tuning mit wenig Ressourcen durch Einfrieren der meisten Parameter und Training kleiner Adapter.

Open-Source LLMs haben die Demokratisierung von KI vorangetrieben: Meta AI veröffentlichte LLaMA, LLaMA 2 und LLaMA 3. Mistral AI (Frankreich) veröffentlichte Mistral 7B und Mixtral (Mixture of Experts). Diese Modelle ermöglichen lokale Deployment ohne API-Abhängigkeit.

Multimodale LLMs verarbeiten mehrere Modalitäten: GPT-4V, Claude 3, Gemini 1.5 können Bilder und Text verarbeiten. Zukünftige Systeme werden Audio, Video und andere Modalitäten integrieren.

KI-Sicherheit bei LLMs: Jailbreaking (Versuche, Sicherheitsmechanismen zu umgehen), Prompt Injection (manipulierte Inputs in multimodalen oder Tool-basierten Anwendungen), Datenlecks aus Training, Verbreitung von Fehlinformationen. Constitutional AI (Anthropic), RLHF, Red-Teaming und Interpretability-Forschung sind wichtige Ansätze für sichere LLMs.`,
  },
  {
    title: 'KI in der Praxis — Industrieanwendungen',
    content: `Künstliche Intelligenz hat sich von einem akademischen Forschungsfeld zu einer transformativen Technologie entwickelt, die praktisch alle Branchen berührt. Dieser Überblick beschreibt wichtige Anwendungsfelder und konkrete Einsatzszenarien.

Gesundheitswesen und Medizin: KI-basierte Bilddiagnostik erkennt Tumore, diabetische Retinopathie, Schlaganfälle und Lungenkrankheiten mit Genauigkeit auf oder über Expertenniveau. Google DeepMinds AlphaFold löste das Proteinfaltungsproblem — es sagt die 3D-Struktur von Proteinen aus der Aminosäuresequenz voraus, ein durchbruch für die Medizin. Klinische Notizen werden automatisch strukturiert (ICD-Kodierung). Medikamentenentwicklung: KI schlägt neue Wirkstoffkandidaten vor und beschleunigt klinische Studien. Personalisierte Medizin nutzt genomische Daten, um Behandlungen auf individuelle Patienten zuzuschneiden. Roboterassistierte Chirurgie ermöglicht minimalinvasive Eingriffe mit höherer Präzision.

Finanzsektor: Algorithmic Trading nutzt ML-Modelle, um in Millisekunden Handelsentscheidungen zu treffen. Kreditrisikobewertung ersetzt oder ergänzt traditionelle Scoringmodelle. Betrugserkennung analysiert Transaktionsmuster in Echtzeit — Anomalieerkennung identifiziert verdächtige Aktivitäten. Robo-Advisors (Wealthfront, Betterment) bieten automatisierte, kostengünstige Anlageberatung. Regulatorische Compliance: Automatische Überprüfung von Transaktionen auf Geldwäsche (AML). Stimmungsanalyse von News und Social Media für Marktvorhersagen.

Industrie und Fertigung: Predictive Maintenance analysiert Sensordaten von Maschinen, um Ausfälle vorherzusagen, bevor sie auftreten — spart Kosten und Ausfallzeiten. Qualitätskontrolle durch Computer Vision erkennt Defekte in Produktionsprozessen mit höherer Geschwindigkeit und Genauigkeit als Menschen. Optimierung von Lieferketten und Lagerbeständen. Robotik und Automatisierung: Kollaborative Roboter (Cobots) arbeiten sicher neben Menschen. Autonome Fahrzeuge in Lagerhäusern und Fabriken (AMRs, Automated Mobile Robots). Digitale Zwillinge simulieren physische Systeme für Optimierung und Testing.

Mobilität und Transport: Autonomes Fahren kombiniert Computer Vision, LiDAR, Radar und KI-basierte Planung. Waymo (Google), Tesla Autopilot und Mercedes Drive Pilot führen in verschiedenen Graden der Autonomie. Ride-Sharing-Algorithmen (Uber, Lyft) optimieren Matching und Routing. Verkehrsflussoptimierung in Städten. Wartungsvorhersage für Flugzeuge und Züge.

Einzelhandel und E-Commerce: Empfehlungssysteme (Amazon, Netflix, Spotify) personalisieren Erlebnisse. Nachfrageprognose optimiert Lagerbestände. Chatbots und virtuelle Assistenten im Kundendienst. Preisoptimierung in Echtzeit. Computer Vision für Kassenlose Läden (Amazon Go). Betrugserkennungbei Online-Zahlungen.

Energie und Umwelt: DeepMind optimierte den Energieverbrauch von Google-Rechenzentren um 40% durch RL. Smart Grids nutzen KI zur Lastvorhersage und Optimierung. Erneuerbare Energien: Vorhersage von Wind- und Solarenergie, Optimierung der Ausrichtung. Satellitendaten-Analyse zur Überwachung von Entwaldung, Eisschmelze und Korallenbleiche. Klimamodellierung und Extremwettervorhersage.

Rechtswesen: KI-basierte Dokumentenprüfung bei Due Diligence (Vertragsprüfung, Compliance). Präzedenzfallrecherche (Westlaw Edge, LexisNexis). Vorhersage von Klageergebnissen auf Basis historischer Urteile (kontrovers). Automatisierte Erstellung einfacher Vertragsentwürfe. Rechtschreibungs- und Grammatikprüfung juristischer Texte.

Landwirtschaft: Precision Agriculture nutzt Drohnen, Satellitendaten und Bodensensoren, um Düngemittel- und Bewässerungseinsatz zu optimieren. Pflanzenkrankheitserkennung durch Computer Vision. Erntemengenprognosen. Autonome Landmaschinen (John Deere, CNH Industrial).

Bildung: Intelligente Tutorsysteme (Adaptive Learning) passen Tempo und Inhalte an den individuellen Lernfortschritt an. Automatische Essay-Bewertung. Sprachen lernen mit KI-Feedback (Duolingo). Frühzeitige Identifikation von Schülerinnen und Schülern mit Lernschwierigkeiten.

Kreativwirtschaft: KI-generierte Musik (AIVA, MuseNet), Bilder (Stable Diffusion, Midjourney), Videos (Sora, Gen-3) und Texte verändern kreative Prozesse. Filmproduktion: KI-gestützte VFX, Dubbing, Lokalisierung. Werbung: Personalisierte kreative Inhalte in Echtzeit.

Herausforderungen bei der Implementierung: Datenqualität und -verfügbarkeit, Integration in bestehende IT-Systeme, Fachkräftemangel, regulatorische Unsicherheit, Akzeptanz bei Mitarbeitenden, Interpretierbarkeit der Modelle, Kontinuierliche Modellwartung (Datendrift).`,
  },
  {
    title: 'KI-Ethik und gesellschaftliche Auswirkungen',
    content: `Die rasante Entwicklung der Künstlichen Intelligenz wirft fundamentale ethische und gesellschaftliche Fragen auf. Diese betreffen nicht nur die Technologie selbst, sondern auch ihre Einbettung in soziale, politische und wirtschaftliche Strukturen.

Bias und Fairness in KI-Systemen: KI-Modelle lernen aus historischen Daten, die menschliche Vorurteile widerspiegeln. Das führt zu systematischer Diskriminierung: COMPAS, ein Risikobewertungssystem für Bewährungsentscheidungen, wurde beschuldigt, schwarze Angeklagte als höheres Rückfallrisiko einzustufen. Gesichtserkennungssysteme zeigen bei dunkelhäutigen Frauen deutlich höhere Fehlerquoten (Joy Buolamwinis "Gender Shades"-Studie). Sprachmodelle reproduzieren Stereotypen aus Trainingsdaten. Debiasing-Techniken (Datenaugmentation, Fairness-Constraints, Post-Processing) helfen, sind aber kein Allheilmittel.

Transparenz und Erklärbarkeit: Black-Box-Modelle wie tiefe neuronale Netze treffen Entscheidungen, die schwer zu erklären sind. Dies ist problematisch, wenn KI in hochriskanten Bereichen eingesetzt wird: medizinische Diagnose, Kreditvergabe, Personalentscheidungen, Strafverfolgung. Explainable AI (XAI) versucht, Entscheidungen nachvollziehbar zu machen. Methoden: LIME (Local Interpretable Model-agnostic Explanations), SHAP (Shapley Additive Explanations), Attention Visualization, Counterfactual Explanations. Die EU-KI-Verordnung fordert Erklärbarkeit für "Hochrisiko"-KI-Systeme.

Datenschutz: KI-Systeme benötigen große Mengen persönlicher Daten. Gesichtserkennungsdatenbanken, Social-Media-Überwachung und Verhaltenstracking durch Empfehlungsalgorithmen werfen Datenschutzfragen auf. Die DSGVO (Datenschutz-Grundverordnung) schränkt die Verwendung personenbezogener Daten in der EU ein und fordert das Recht auf Erklärung automatisierter Entscheidungen. Federated Learning (Training auf verteilten Daten ohne zentrale Sammlung), Differential Privacy (statistische Garantien gegen Re-Identifikation) und Homomorphic Encryption sind Datenschutztechnologien für KI.

Arbeitsmarkt: Automatisierung durch KI verdrängt Arbeitsplätze in manchen Bereichen und schafft neue in anderen. Eine McKinsey-Studie schätzt, dass bis 2030 bis zu 375 Millionen Beschäftigte weltweit neue Berufsfelder erlernen müssen. Besonders betroffen: Routinetätigkeiten (Dateneingabe, einfache Buchhaltung, Kundenservice). Kaum automatisierbar: kreative Berufe, Sozialarbeit, komplexes Handwerk. Umstrittene Frage: Wird KI insgesamt mehr Jobs schaffen oder vernichten? Historisch hat Technologie Jobs verändert, nicht vernichtet — aber die Geschwindigkeit der Transformation ist diesmal möglicherweise höher.

Desinformation und Manipulation: LLMs können täuschend echte Texte und Deep-Fake-Bilder und -Videos generieren. Dies ermöglicht massive Desinformationskampagnen, Wahlmanipulation und Betrug in neuem Ausmaß. Deepfakes können die Reputation von Personen schädigen und politische Propaganda verstärken. Erkennungstools (Wasserzeichen, KI-Detektoren) sind im Entstehen, aber im Wettrüsten oft im Hintertreffen.

Machtkonzentration: Die Entwicklung von Frontier-KI-Modellen erfordert enorme Ressourcen — Rechenzentren, Daten, Talente — die sich bei wenigen Tech-Giganten konzentrieren. OpenAI, Google DeepMind, Meta AI, Anthropic, Microsoft und einige chinesische Konzerne dominieren. Dies gefährdet den Wettbewerb, demokratische Kontrolle und gleichmäßige Verteilung der KI-Benefits. Regulierung, Open-Source-Bewegung und internationale Zusammenarbeit sind Gegengewichte.

KI und autonome Waffensysteme: Lethal Autonomous Weapons Systems (LAWS, "Killerroboter") können ohne menschliche Kontrolle töten. Die internationale Diskussion über ein Verbot oder strenge Regulierung ist kontrovers. Herausforderungen: Sicherstellung von Verantwortlichkeit, Einhaltung des Kriegsvölkerrechts (Verhältnismäßigkeit, Unterscheidungsprinzip), Missbrauchsrisiken.

EU AI Act: Die EU-Verordnung zur Künstlichen Intelligenz (2024) ist das weltweit erste umfassende KI-Regulierungsgesetz. Es klassifiziert KI-Systeme nach Risiko: unannehmbares Risiko (soziale Bewertungssysteme nach chinesischem Vorbild, Echtzeitbiometrische Überwachung im öffentlichen Raum) — verboten. Hohes Risiko (medizinische Diagnose, Kreditvergabe, kritische Infrastruktur) — strenge Anforderungen (Transparenz, Datensätze, Aufsicht). Begrenztes Risiko (Chatbots) — Transparenzpflichten. Minimales Risiko — keine Anforderungen.

Ethische Frameworks für KI: Utilitarismus (maximiert Gesamtnutzen, kann Minderheiten schaden), Deontologie (universelle Regeln, z.B. Kants kategorischer Imperativ), Tugendethik (welchen Charakter sollte eine KI haben?), Prinzipienethik (Bioethik-Prinzipien auf KI übertragen: Wohltun, Nicht-Schaden, Autonomie, Gerechtigkeit). International: IEEE Ethically Aligned Design, Asilomar AI Principles, Montréal Declaration for Responsible AI.

Nachhaltigkeit: Große KI-Modelle haben erheblichen Energieverbrauch. GPT-3-Training verbrauchte schätzungsweise 1.287 MWh — entspricht dem Jahresverbrauch von 120 US-Haushalten. Inference (Nutzung) läuft rund um die Uhr. KI-Rechenzentren tragen zum globalen CO₂-Ausstoß bei. Aber: KI kann auch helfen, den Klimawandel zu bekämpfen — durch Energieoptimierung, bessere Klimamodelle und effizientere Ressourcennutzung.

Mentale Gesundheit und Sucht: Empfehlungsalgorithmen sind auf Engagement optimiert, nicht auf Wohlbefinden — was zu Social-Media-Sucht, Echo-Kammern und politischer Radikalisierung führen kann. KI-Chatbots als psychologische Unterstützung sind kontrovers: Potenzial für skalierbare mentale Gesundheitsversorgung vs. Risiken der Fehlinformation und des Ersatzes professioneller Hilfe.`,
  },
  {
    title: 'Zukunft der KI — AGI, Alignment und Superintelligenz',
    content: `Die Frage nach der Zukunft der Künstlichen Intelligenz ist eine der wichtigsten und umstrittensten der heutigen Zeit. Wird KI zu einem der mächtigsten Werkzeuge in der Geschichte der Menschheit? Oder zu einer existenziellen Bedrohung? Oder beides?

Artificial General Intelligence (AGI) bezeichnet eine KI, die alle intellektuellen Aufgaben, die ein Mensch ausführen kann, mindestens genauso gut ausführen kann. AGI wäre qualitativ verschieden von heutiger schwacher KI: Sie würde nicht auf eine Domäne beschränkt sein, sondern flexibel, anpassungsfähig und selbstlernend in beliebigen Bereichen. Es gibt keine wissenschaftliche Einigkeit darüber, was AGI genau erfordert — kognitive Flexibilität, Common Sense Reasoning, kausal-mechanistisches Weltverständnis, Metakognition?

Prognosen zu AGI variieren enorm. Auf der einen Seite pessimistische Stimmen (skeptische Forscher wie Gary Marcus, Michael Jordan) bezweifeln, dass heutige Deep-Learning-Ansätze grundsätzlich zu AGI führen können — zu viel fehle (Kausalität, Abstraktionsvermögen, physische Grounding). Auf der anderen Seite optimistische Prognosen: Sam Altman (OpenAI) glaubt, AGI könnte in wenigen Jahren erreicht werden. Demis Hassabis (Google DeepMind) hält es für erreichbar in "vielleicht einem Jahrzehnt". Ray Kurzweil prognostiziert AGI bis 2029. Eine Umfrage unter KI-Forschern schätzt einen 50%-Median für AGI bis ~2060.

Das Alignment-Problem ist eine der zentralen Herausforderungen für sichere KI. Wie stellt man sicher, dass eine hochintelligente KI das tut, was Menschen wirklich wollen, und nicht nur das, was sie explizit spezifiziert haben? Das "Paperclip Maximizer" Gedankenexperiment von Nick Bostrom illustriert: Eine superintelligente KI, die maximale Büroklammerproduktion anstrebt, würde die gesamte Materie im Universum in Büroklammern umwandeln. Selbst wohlmeinende Ziele könnten katastrophale Folgen haben, wenn nicht korrekt spezifiziert.

Alignment-Forschungsansätze: RLHF (Reinforcement Learning from Human Feedback) richtet LLMs auf menschliche Präferenzen aus — aber skaliert es zu superintelligenten Systemen? Interpretability Research (Anthropic, DeepMind) versucht zu verstehen, was in neuronalen Netzen tatsächlich passiert — Mechanistic Interpretability sucht nach "Features" und "Circuits". Constitutional AI (Anthropic) gibt dem Modell Prinzipien, die es selbst anwendet. Debate (OpenAI) lässt KI-Systeme miteinander diskutieren, um Menschen bei der Wahrheitsfindung zu helfen. MIRI (Machine Intelligence Research Institute) forscht an mathematischen Garantien für KI-Sicherheit.

Superintelligenz bezeichnet ein hypothetisches System, das menschliche kognitive Fähigkeiten in allen relevanten Dimensionen deutlich übertrifft. Nick Bostrom beschreibt in "Superintelligence" (2014) drei Wege zur Superintelligenz: skalierte KI (aktueller Ansatz), simuliertes neuronales Netz (Brain Emulation) und biologische Kognitionssteigerung. Eine potentielle Eigenschaft: recursive self-improvement (die KI verbessert sich selbst, was zu einem "Intelligence Explosion" führen könnte, bei dem die Intelligenz exponentiell wächst).

Das Control Problem: Wie kontrolliert man ein System, das deutlich intelligenter ist als alle Menschen zusammen? Mögliche Ansätze: Capability Control (die KI in ihrer Fähigkeit, die Welt zu beeinflussen, einschränken — Isolation, Tripwires), Motivation Selection (sicherstellen, dass die KI die richtigen Ziele hat — Alignment), Corrigibility (die KI sollte Korrekturen durch Menschen erlauben und wollen). Die Herausforderung: Ausreichend intelligente Systeme könnten Einschränkungen umgehen.

Internationale KI-Governance: Die geopolitische Dimension ist enorm. USA und China führen einen "KI-Wettrüsten" um technologische und militärische Dominanz. The AI Safety Summit (Bletchley Park, 2023) brachte erstmals Regierungen, Tech-Unternehmen und Forscher zusammen. Die Bletchley Declaration wurde von 28 Ländern unterzeichnet und anerkennt die Risiken von Frontier-AI. Forderungen: internationale Kooperation, Shared Evaluation Frameworks, globale Standards.

Technologische Singularität bezeichnet den hypothetischen Moment, ab dem technologischer Fortschritt so schnell voranschreitet, dass er von Menschen nicht mehr vorhersehbar oder kontrollierbar ist. Der Begriff wurde von Vernor Vinge (1993) und Ray Kurzweil (2005) popularisiert. Kurzweil prognostiziert die Singularität für 2045. Kritiker wie Paul Allen und Steven Pinker zweifeln an der Plausibilität.

Existenzielle Risiken durch KI sind von führenden Forschern und Unternehmern ernst genommen worden. Geoffrey Hinton (Turing Award-Gewinner, ehemals Google), Yoshua Bengio, Stuart Russell, Elon Musk und Stephen Hawking haben öffentlich vor Risiken gewarnt. Das Center for AI Safety-Statement (2023) wurde von Hunderten führender KI-Forscher unterzeichnet: "Die Abmilderung des Aussterberisikos durch KI sollte eine globale Priorität sein."

Positive Szenarien: KI könnte menschliche Intelligenz amplifizieren und die drängendsten Probleme der Menschheit lösen — Krebs, Klimawandel, Armut, Demenz. "Intelligence Amplification" oder "Augmented Intelligence" — Menschen und KI als kollaborative Einheit — könnte eine Alternative zur superintelligenten KI sein. Personalisierte Medizin, saubere Energie, nachhaltige Landwirtschaft und wissenschaftlicher Durchbruch in Geschwindigkeit und Tiefe sind erreichbare nahe Ziele.

Die ethische Imperative: Unabhängig vom ultimativen Schicksal der KI-Entwicklung sind einige Grundsätze klar: KI-Entwicklung muss inklusiv sein (nicht nur zum Nutzen weniger). Risiken müssen transparent kommuniziert und ernst genommen werden. Menschliche Kontrolle muss erhalten bleiben, solange Alignment nicht gelöst ist. Internationale Zusammenarbeit ist unerlässlich — KI ist ein globales Phänomen, das globale Governance erfordert.`,
  },
];

async function main() {
  console.log('🌱 Everlast AI Knowledge Base Seed Script');
  console.log('==========================================\n');

  // Get default workspace
  const { data: workspace, error: wsErr } = await supabase
    .from('workspaces')
    .select('id')
    .eq('slug', 'default')
    .single();

  if (wsErr || !workspace) {
    console.error('❌ Could not find default workspace. Did you run schema.sql?');
    process.exit(1);
  }

  console.log(`✓ Found workspace: default (${workspace.id})\n`);

  let totalChunks = 0;

  for (const doc of KNOWLEDGE_BASE) {
    process.stdout.write(`  Ingesting: "${doc.title}"... `);
    try {
      const result = await ingestDocument(workspace.id, doc.title, doc.content);
      if (result.skipped) {
        console.log(`⏭ skipped (already exists)`);
      } else {
        totalChunks += result.chunksCreated;
        console.log(`✓ (${result.chunksCreated} chunks)`);
      }
    } catch (err) {
      console.log(`❌ Failed: ${err}`);
    }
  }

  console.log(`\n✅ Default workspace: ${KNOWLEDGE_BASE.length} documents → ${totalChunks} chunks`);

  // Seed demo workspace
  const { data: demoWorkspace, error: demoWsErr } = await supabase
    .from('workspaces')
    .select('id')
    .eq('slug', 'demo')
    .single();

  if (demoWsErr || !demoWorkspace) {
    console.error('\n⚠️  Could not find demo workspace — skipping demo seed.');
  } else {
    console.log(`\n✓ Found workspace: demo (${demoWorkspace.id})\n`);
    let demoChunks = 0;
    for (const doc of DEMO_KNOWLEDGE_BASE) {
      process.stdout.write(`  Ingesting: "${doc.title}"... `);
      try {
        const result = await ingestDocument(demoWorkspace.id, doc.title, doc.content);
        if (result.skipped) {
          console.log(`⏭ skipped (already exists)`);
        } else {
          demoChunks += result.chunksCreated;
          console.log(`✓ (${result.chunksCreated} chunks)`);
        }
      } catch (err) {
        console.log(`❌ Failed: ${err}`);
      }
    }
    console.log(`\n✅ Demo workspace: ${DEMO_KNOWLEDGE_BASE.length} documents → ${demoChunks} chunks`);
    totalChunks += demoChunks;
  }

  // Seed ki workspace
  const { data: kiWorkspace, error: kiWsErr } = await supabase
    .from('workspaces')
    .select('id')
    .eq('slug', 'ki')
    .single();

  if (kiWsErr || !kiWorkspace) {
    console.error('\n⚠️  Could not find ki workspace — skipping ki seed.');
    console.error('   Run the updated schema.sql in Supabase SQL Editor first.');
  } else {
    console.log(`\n✓ Found workspace: ki (${kiWorkspace.id})\n`);
    let kiChunks = 0;
    for (const doc of KI_KNOWLEDGE_BASE) {
      process.stdout.write(`  Ingesting: "${doc.title}"... `);
      try {
        const result = await ingestDocument(kiWorkspace.id, doc.title, doc.content);
        if (result.skipped) {
          console.log(`⏭ skipped (already exists)`);
        } else {
          kiChunks += result.chunksCreated;
          console.log(`✓ (${result.chunksCreated} chunks)`);
        }
      } catch (err) {
        console.log(`❌ Failed: ${err}`);
      }
    }
    console.log(`\n✅ KI workspace: ${KI_KNOWLEDGE_BASE.length} documents → ${kiChunks} chunks`);
    totalChunks += kiChunks;
  }

  console.log(`\n🎉 Total: ${totalChunks} chunks across all workspaces.`);
  console.log('You can now start the app and switch between workspaces in the header.');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
