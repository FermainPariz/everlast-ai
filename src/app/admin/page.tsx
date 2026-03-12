'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import IngestForm from '@/components/admin/IngestForm';
import DocumentList from '@/components/admin/DocumentList';

export default function AdminPage() {
  const [workspaceSlug, setWorkspaceSlug] = useState(
    process.env.NEXT_PUBLIC_DEFAULT_WORKSPACE ?? 'default'
  );
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="flex flex-col h-screen page-glow">
      <Header workspaceSlug={workspaceSlug} onWorkspaceChange={setWorkspaceSlug} />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <h1
              className="text-xl font-semibold"
              style={{ color: 'var(--text-primary)', textWrap: 'balance' } as React.CSSProperties}
            >
              Wissensbasis-Verwaltung
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Dokumente im Workspace{' '}
              <span className="font-medium text-cyan-400">{workspaceSlug}</span> verwalten.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Ingest Form */}
            <div
              className="rounded-xl p-6"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
            >
              <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                Dokument hinzufügen
              </h2>
              <IngestForm
                workspaceSlug={workspaceSlug}
                onSuccess={() => setRefreshKey((k) => k + 1)}
              />
            </div>

            {/* Document List */}
            <div
              className="rounded-xl p-6"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
            >
              <h2 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                Dokumente
                <span
                  className="text-xs font-normal px-1.5 py-0.5 rounded"
                  style={{ background: 'rgba(34,211,238,0.1)', color: '#22d3ee' }}
                >
                  {workspaceSlug}
                </span>
              </h2>
              <DocumentList workspaceSlug={workspaceSlug} refreshKey={refreshKey} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
