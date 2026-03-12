'use client';

const WORKSPACES = [
  { slug: 'ki', name: 'KI Wissensbasis' },
  { slug: 'demo', name: 'Demo Workspace' },
  { slug: 'default', name: 'Everlast AI' },
];

interface WorkspaceSelectorProps {
  currentSlug: string;
  onChange: (slug: string) => void;
}

export default function WorkspaceSelector({ currentSlug, onChange }: WorkspaceSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Workspace:</span>
      <select
        value={currentSlug}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Workspace auswählen"
        className="text-sm rounded-md px-2 py-1 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:outline-none"
        style={{
          background: 'var(--bg-elevated)',
          color: 'var(--text-primary)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        {WORKSPACES.map((ws) => (
          <option key={ws.slug} value={ws.slug} style={{ background: '#161b25' }}>
            {ws.name}
          </option>
        ))}
      </select>
    </div>
  );
}
