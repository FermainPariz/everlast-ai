'use client';

import { useCallback, useEffect, useState } from 'react';
import { FileText, Trash2 } from 'lucide-react';

interface DocumentItem {
  id: string;
  title: string;
  chunkCount: number;
  createdAt: string;
}

interface DocumentListProps {
  workspaceSlug: string;
  refreshKey: number;
}

export default function DocumentList({ workspaceSlug, refreshKey }: DocumentListProps) {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/documents?workspaceSlug=${encodeURIComponent(workspaceSlug)}`);
      const data = await res.json();
      setDocuments(data.documents ?? []);
    } catch {
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, [workspaceSlug]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments, refreshKey]);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`"${title}" löschen? Alle ${documents.find((d) => d.id === id)?.chunkCount ?? 0} Chunks werden entfernt.`)) return;
    setDeletingId(id);
    try {
      await fetch(`/api/documents?id=${id}`, { method: 'DELETE' });
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-14 rounded-lg animate-pulse"
            style={{ background: 'var(--bg-elevated)' }}
          />
        ))}
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
        <FileText aria-hidden="true" size={32} style={{ color: 'rgba(255,255,255,0.1)' }} />
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Noch keine Dokumente. Füge dein erstes Dokument über das Formular hinzu.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="flex items-center justify-between p-3 rounded-lg gap-4 transition-colors"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
              {doc.title}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="text-xs px-1.5 py-0.5 rounded font-medium"
                style={{ background: 'rgba(34,211,238,0.1)', color: '#22d3ee' }}
              >
                {doc.chunkCount} {doc.chunkCount !== 1 ? 'Chunks' : 'Chunk'}
              </span>
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {new Date(doc.createdAt).toLocaleDateString('de-DE')}
              </span>
            </div>
          </div>
          <button
            onClick={() => handleDelete(doc.id, doc.title)}
            disabled={deletingId === doc.id}
            aria-label={`${doc.title} löschen`}
            className="flex-shrink-0 p-1.5 rounded transition-colors disabled:opacity-40"
            style={{ color: 'rgba(248,113,113,0.6)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(248,113,113,0.6)'; e.currentTarget.style.background = 'transparent'; }}
          >
            {deletingId === doc.id ? (
              <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Trash2 aria-hidden="true" size={15} />
            )}
          </button>
        </div>
      ))}
    </div>
  );
}
