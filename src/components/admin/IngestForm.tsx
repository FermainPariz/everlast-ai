'use client';

import { useState } from 'react';

interface IngestFormProps {
  workspaceSlug: string;
  onSuccess: () => void;
}

export default function IngestForm({ workspaceSlug, onSuccess }: IngestFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [result, setResult] = useState<{ chunksCreated: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
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

      if (!res.ok) {
        throw new Error(data.error ?? 'Ingestion failed');
      }

      setResult({ chunksCreated: data.chunksCreated });
      setStatus('success');
      setTitle('');
      setContent('');
      setSourceUrl('');
      onSuccess();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unknown error');
      setStatus('error');
    }
  }

  const tokenCount = content.length > 0 ? Math.ceil(content.length / 4) : 0;
  const tokenBadgeStyle =
    tokenCount > 10000
      ? { background: 'rgba(239,68,68,0.15)', color: '#f87171' }
      : tokenCount > 2000
      ? { background: 'rgba(234,179,8,0.15)', color: '#facc15' }
      : { background: 'rgba(34,211,238,0.12)', color: '#22d3ee' };

  const inputStyle = {
    background: 'var(--bg-base)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: 'var(--text-primary)',
    borderRadius: '8px',
  };
  const labelStyle = { color: 'var(--text-secondary)' };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-xs font-medium mb-1.5" style={labelStyle}>
          Dokumenttitel <span className="text-red-400">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="z.B. Produkt-FAQ, Unternehmenshandbuch, Release Notes v2.1"
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
          <p className="mt-1.5 text-xs flex items-center gap-1.5">
            <span
              className="px-1.5 py-0.5 rounded text-xs font-medium"
              style={tokenBadgeStyle}
            >
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
        <div
          className="rounded-lg px-4 py-3 text-sm"
          style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', color: '#4ade80' }}
        >
          Dokument importiert — {result.chunksCreated} Chunks erstellt und eingebettet.
        </div>
      )}

      {status === 'error' && (
        <div
          className="rounded-lg px-4 py-3 text-sm"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}
        >
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
          <>
            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            Importieren...
          </>
        ) : (
          'Dokument importieren'
        )}
      </button>
    </form>
  );
}
