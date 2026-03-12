'use client';

import { useRef, useState } from 'react';

interface IngestFormProps {
  workspaceSlug: string;
  onSuccess: () => void;
}

type Mode = 'text' | 'file';

export default function IngestForm({ workspaceSlug, onSuccess }: IngestFormProps) {
  const [mode, setMode] = useState<Mode>('text');

  // Text mode state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');

  // File mode state
  const [file, setFile] = useState<File | null>(null);
  const [fileTitle, setFileTitle] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [result, setResult] = useState<{ chunksCreated: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const inputStyle = {
    background: 'var(--bg-base)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: 'var(--text-primary)',
    borderRadius: '8px',
  };
  const labelStyle = { color: 'var(--text-secondary)' };

  function resetStatus() {
    setStatus('idle');
    setResult(null);
    setErrorMsg('');
  }

  function handleFileSelect(selected: File | null) {
    if (!selected) return;
    setFile(selected);
    const nameWithoutExt = selected.name.replace(/\.[^.]+$/, '');
    setFileTitle(nameWithoutExt);
    resetStatus();
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files[0] ?? null);
  }

  async function handleTextSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setStatus('loading');
    setResult(null);
    setErrorMsg('');
    try {
      const res = await fetch('/api/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          workspaceSlug,
          sourceUrl: sourceUrl.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Ingestion fehlgeschlagen');
      setResult({ chunksCreated: data.chunksCreated });
      setStatus('success');
      setTitle('');
      setContent('');
      setSourceUrl('');
      onSuccess();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unbekannter Fehler');
      setStatus('error');
    }
  }

  async function handleFileSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !fileTitle.trim()) return;
    setStatus('loading');
    setResult(null);
    setErrorMsg('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('title', fileTitle.trim());
      fd.append('workspaceSlug', workspaceSlug);
      const res = await fetch('/api/ingest/file', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Upload fehlgeschlagen');
      setResult({ chunksCreated: data.chunksCreated });
      setStatus('success');
      setFile(null);
      setFileTitle('');
      onSuccess();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unbekannter Fehler');
      setStatus('error');
    }
  }

  const tokenCount = mode === 'text'
    ? (content.length > 0 ? Math.ceil(content.length / 4) : 0)
    : (file ? Math.ceil(file.size / 4) : 0);

  const tokenBadgeStyle =
    tokenCount > 10000
      ? { background: 'rgba(239,68,68,0.15)', color: '#f87171' }
      : tokenCount > 2000
      ? { background: 'rgba(234,179,8,0.15)', color: '#facc15' }
      : { background: 'rgba(34,211,238,0.12)', color: '#22d3ee' };

  const tabBase = 'flex-1 py-1.5 text-xs font-medium rounded-md transition-colors';
  const tabActive = { background: 'var(--bg-base)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.1)' };
  const tabInactive = { background: 'transparent', color: 'var(--text-secondary)', border: '1px solid transparent' };

  return (
    <div className="space-y-4">
      {/* Tab switcher */}
      <div
        className="flex gap-1 p-1 rounded-lg"
        style={{ background: 'var(--bg-elevated)' }}
      >
        <button
          type="button"
          onClick={() => { setMode('text'); resetStatus(); }}
          className={tabBase}
          style={mode === 'text' ? tabActive : tabInactive}
        >
          Text eingeben
        </button>
        <button
          type="button"
          onClick={() => { setMode('file'); resetStatus(); }}
          className={tabBase}
          style={mode === 'file' ? tabActive : tabInactive}
        >
          Datei hochladen
        </button>
      </div>

      {mode === 'text' ? (
        <form onSubmit={handleTextSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-xs font-medium mb-1.5" style={labelStyle}>
              Dokumenttitel <span className="text-red-400">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="z.B. Produkt-FAQ, Unternehmenshandbuch"
              required
              className="w-full px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
              style={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-xs font-medium mb-1.5" style={labelStyle}>
              Dokumentinhalt <span className="text-red-400">*</span>
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Dokumenttext hier einfügen..."
              required
              rows={10}
              className="w-full px-3 py-2 text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 resize-y"
              style={inputStyle}
            />
            {content.length > 0 && (
              <p className="mt-1.5 text-xs">
                <span className="px-1.5 py-0.5 rounded text-xs font-medium" style={tokenBadgeStyle}>
                  ~{tokenCount.toLocaleString()} Tokens
                </span>
              </p>
            )}
          </div>

          <div>
            <label htmlFor="sourceUrl" className="block text-xs font-medium mb-1.5" style={labelStyle}>
              Quell-URL <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>(optional)</span>
            </label>
            <input
              id="sourceUrl"
              type="url"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
              style={inputStyle}
            />
          </div>

          {status === 'success' && result && (
            <div className="rounded-lg px-4 py-3 text-sm" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', color: '#4ade80' }}>
              Dokument importiert — {result.chunksCreated} Chunks erstellt.
            </div>
          )}
          {status === 'error' && (
            <div className="rounded-lg px-4 py-3 text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}>
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={!title.trim() || !content.trim() || status === 'loading'}
            className="w-full text-sm font-medium py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg, #22d3ee 0%, #0891b2 100%)', color: '#000' }}
          >
            {status === 'loading' ? (
              <><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />Importieren...</>
            ) : 'Dokument importieren'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleFileSubmit} className="space-y-4">
          {/* Drop zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className="cursor-pointer rounded-xl flex flex-col items-center justify-center gap-2 py-8 px-4 text-center transition-all"
            style={{
              border: `2px dashed ${isDragging ? 'rgba(34,211,238,0.6)' : file ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.12)'}`,
              background: isDragging ? 'rgba(34,211,238,0.05)' : file ? 'rgba(34,197,94,0.05)' : 'var(--bg-base)',
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md,.pdf,.docx"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
            />
            {file ? (
              <>
                <span className="text-2xl">📄</span>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{file.name}</p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {(file.size / 1024).toFixed(1)} KB
                  {tokenCount > 0 && <> · ~{tokenCount.toLocaleString()} Tokens</>}
                </p>
                <p className="text-xs" style={{ color: '#22d3ee' }}>Andere Datei wählen</p>
              </>
            ) : (
              <>
                <span className="text-2xl">📁</span>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Datei hier ablegen oder klicken
                </p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  .txt · .md · .pdf · .docx · max. 10 MB
                </p>
              </>
            )}
          </div>

          <div>
            <label htmlFor="fileTitle" className="block text-xs font-medium mb-1.5" style={labelStyle}>
              Dokumenttitel <span className="text-red-400">*</span>
            </label>
            <input
              id="fileTitle"
              type="text"
              value={fileTitle}
              onChange={(e) => setFileTitle(e.target.value)}
              placeholder="Titel des Dokuments"
              required
              className="w-full px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
              style={inputStyle}
            />
          </div>

          {status === 'success' && result && (
            <div className="rounded-lg px-4 py-3 text-sm" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', color: '#4ade80' }}>
              Datei importiert — {result.chunksCreated} Chunks erstellt.
            </div>
          )}
          {status === 'error' && (
            <div className="rounded-lg px-4 py-3 text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}>
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={!file || !fileTitle.trim() || status === 'loading'}
            className="w-full text-sm font-medium py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg, #22d3ee 0%, #0891b2 100%)', color: '#000' }}
          >
            {status === 'loading' ? (
              <><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />Hochladen & Einbetten...</>
            ) : 'Datei importieren'}
          </button>
        </form>
      )}
    </div>
  );
}
