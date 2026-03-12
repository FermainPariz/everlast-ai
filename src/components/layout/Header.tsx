'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { SquarePen } from 'lucide-react';
import WorkspaceSelector from '@/components/ui/WorkspaceSelector';

interface HeaderProps {
  workspaceSlug: string;
  onWorkspaceChange: (slug: string) => void;
  onNewChat?: () => void;
}

export default function Header({ workspaceSlug, onWorkspaceChange, onNewChat }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between px-6 py-3"
      style={{
        background: 'rgba(8, 10, 15, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div className="flex items-center gap-8">
        <Link href="/chat" className="flex items-center gap-2.5 group" aria-label="Everlast AI — Startseite">
          {/* Custom SVG Logomark — two overlapping rounded squares */}
          <div className="logo-pulse rounded-lg" style={{ width: 28, height: 28, flexShrink: 0 }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <rect x="3" y="3" width="16" height="16" rx="4" fill="url(#lg1)" opacity="0.9"/>
              <rect x="9" y="9" width="16" height="16" rx="4" fill="url(#lg2)" opacity="0.85"/>
              <defs>
                <linearGradient id="lg1" x1="3" y1="3" x2="19" y2="19" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#22d3ee"/>
                  <stop offset="1" stopColor="#0891b2"/>
                </linearGradient>
                <linearGradient id="lg2" x1="9" y1="9" x2="25" y2="25" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#0e7490"/>
                  <stop offset="1" stopColor="#164e63"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="font-semibold tracking-tight" style={{ fontSize: 15, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            <span style={{ color: '#22d3ee' }}>Everlast</span>{' '}
            <span style={{ color: 'var(--text-primary)' }}>AI</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1" aria-label="Hauptnavigation">
          <Link
            href="/chat"
            className={clsx(
              'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
              pathname.startsWith('/chat')
                ? 'text-cyan-300 bg-cyan-500/10 border border-cyan-500/20'
                : 'hover:bg-white/5'
            )}
            style={{ color: pathname.startsWith('/chat') ? undefined : 'var(--text-secondary)' }}
          >
            Chat
          </Link>
          <Link
            href="/admin"
            className={clsx(
              'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
              pathname.startsWith('/admin')
                ? 'text-cyan-300 bg-cyan-500/10 border border-cyan-500/20'
                : 'hover:bg-white/5'
            )}
            style={{ color: pathname.startsWith('/admin') ? undefined : 'var(--text-secondary)' }}
          >
            Verwaltung
          </Link>
          {pathname.startsWith('/chat') && onNewChat && (
            <button
              onClick={onNewChat}
              aria-label="Neues Gespräch starten"
              title="Neues Gespräch"
              className="ml-1 p-1.5 rounded-md transition-colors hover:bg-white/5"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#22d3ee'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              <SquarePen size={15} strokeWidth={2} aria-hidden="true" />
            </button>
          )}
        </nav>
      </div>

      <WorkspaceSelector
        currentSlug={workspaceSlug}
        onChange={onWorkspaceChange}
      />
    </header>
  );
}
