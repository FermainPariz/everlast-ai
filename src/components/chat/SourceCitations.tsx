'use client';

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import type { SourceCitation } from '@/types';

interface SourceCitationsProps {
  sources: SourceCitation[];
}

function similarityColor(score: number): { bg: string; text: string } {
  if (score >= 0.7) return { bg: 'rgba(34, 197, 94, 0.12)', text: '#4ade80' };
  if (score >= 0.5) return { bg: 'rgba(234, 179, 8, 0.12)', text: '#facc15' };
  return { bg: 'rgba(148, 163, 184, 0.12)', text: '#94a3b8' };
}

export default function SourceCitations({ sources }: SourceCitationsProps) {
  const [open, setOpen] = useState(false);

  if (sources.length === 0) return null;

  return (
    <div className="mt-3 text-xs">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 transition-colors select-none"
        style={{ color: 'var(--text-secondary)' }}
        aria-expanded={open}
      >
        <ChevronRight
          aria-hidden="true"
          size={12}
          className="text-cyan-400 transition-transform duration-200"
          style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}
        />
        <span className="text-cyan-400">{sources.length} {sources.length === 1 ? 'Quelle' : 'Quellen'}</span>
        <span>verwendet</span>
      </button>
      {open && (
        <div className="mt-2 space-y-2">
          {sources.map((source, i) => {
            const { bg, text } = similarityColor(source.similarity);
            return (
              <div
                key={i}
                className="rounded-lg p-3"
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid rgba(34, 211, 238, 0.12)',
                }}
              >
                <div className="flex items-center justify-between mb-1.5 gap-2">
                  <span className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                    {source.docTitle}
                  </span>
                  <span
                    className="flex-shrink-0 px-1.5 py-0.5 rounded text-xs font-medium"
                    style={{ background: bg, color: text }}
                  >
                    {Math.round(source.similarity * 100)}%
                  </span>
                </div>
                <p className="leading-relaxed line-clamp-3" style={{ color: 'var(--text-secondary)' }}>
                  {source.content}
                  {source.content.length >= 200 ? '…' : ''}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
