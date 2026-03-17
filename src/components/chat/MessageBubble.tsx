'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Sparkles, Copy, Check, Volume2, VolumeX, Loader2 } from 'lucide-react';
import SourceCitations from './SourceCitations';
import type { SourceCitation } from '@/types';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface MessageBubbleProps {
  message: ChatMessage;
  sources?: SourceCitation[];
  onSpeak?: (text: string) => void;
  onStopSpeaking?: () => void;
  isSpeaking?: boolean;
  isTtsLoading?: boolean;
}

export default function MessageBubble({
  message,
  sources,
  onSpeak,
  onStopSpeaking,
  isSpeaking = false,
  isTtsLoading = false,
}: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(message.content);
    } catch {
      const el = document.createElement('textarea');
      el.value = message.content;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function handleTts() {
    if (isSpeaking || isTtsLoading) {
      onStopSpeaking?.();
    } else {
      onSpeak?.(message.content);
    }
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isUser && (
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #22d3ee 0%, #0891b2 100%)' }}
          aria-hidden="true"
        >
          <Sparkles size={12} className="text-black" strokeWidth={2.5} />
        </div>
      )}
      <div className={`max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div
          className="group relative rounded-2xl px-4 py-3 text-sm leading-relaxed"
          style={
            isUser
              ? {
                  background: 'linear-gradient(135deg, #0891b2 0%, #22d3ee 100%)',
                  color: '#000',
                  borderRadius: '18px 18px 4px 18px',
                  fontWeight: 500,
                }
              : {
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  borderTop: '1px solid rgba(34,211,238,0.2)',
                  color: 'var(--text-primary)',
                  borderRadius: '4px 18px 18px 18px',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
                }
          }
        >
          {!isUser && (
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
              {/* TTS button */}
              {onSpeak && message.content && (
                <button
                  onClick={handleTts}
                  aria-label={isSpeaking ? 'Wiedergabe stoppen' : 'Antwort vorlesen'}
                  className="p-1 rounded transition-colors"
                  style={{
                    color: isSpeaking || isTtsLoading ? '#22d3ee' : 'var(--text-secondary)',
                  }}
                >
                  {isTtsLoading ? (
                    <Loader2 size={13} strokeWidth={2} className="animate-spin" />
                  ) : isSpeaking ? (
                    <VolumeX size={13} strokeWidth={2} />
                  ) : (
                    <Volume2 size={13} strokeWidth={2} />
                  )}
                </button>
              )}
              {/* Copy button */}
              <button
                onClick={handleCopy}
                aria-label="Antwort kopieren"
                className="p-1 rounded transition-colors"
                style={{ color: copied ? '#4ade80' : 'var(--text-secondary)' }}
              >
                {copied ? <Check size={13} strokeWidth={2.5} /> : <Copy size={13} strokeWidth={2} />}
              </button>
            </div>
          )}
          {isUser ? (
            message.content
          ) : (
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h1 className="text-base font-bold mb-1 mt-2 first:mt-0" style={{ color: 'var(--text-primary)' }}>{children}</h1>,
                h2: ({ children }) => <h2 className="text-sm font-semibold mb-1 mt-2 first:mt-0" style={{ color: 'var(--text-primary)' }}>{children}</h2>,
                h3: ({ children }) => <h3 className="text-sm font-medium mb-0.5 mt-1.5 first:mt-0" style={{ color: 'var(--text-primary)' }}>{children}</h3>,
                p: ({ children }) => {
                  if (!children || (typeof children === 'string' && children.trim() === '')) return null;
                  return <p className="mb-1.5 last:mb-0 leading-relaxed">{children}</p>;
                },
                ul: ({ children }) => <ul className="mb-1.5 space-y-0.5 pl-4 list-disc">{children}</ul>,
                ol: ({ children }) => <ol className="mb-1.5 space-y-0.5 pl-4 list-decimal">{children}</ol>,
                li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                strong: ({ children }) => <strong className="font-semibold" style={{ color: 'var(--text-primary)' }}>{children}</strong>,
                em: ({ children }) => <em className="italic">{children}</em>,
                code: ({ children }) => <code className="px-1 py-0.5 rounded text-xs font-mono" style={{ background: 'rgba(34,211,238,0.08)', color: '#22d3ee' }}>{children}</code>,
                hr: () => <hr className="my-3 border-white/10" />,
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 underline underline-offset-2 hover:text-cyan-300 transition-colors"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>
        {!isUser && sources !== undefined && sources.length === 0 && (
          <p className="text-xs mt-1.5 px-1" style={{ color: 'var(--text-secondary)' }}>
            Keine passenden Dokumente in der Wissensbasis gefunden.
          </p>
        )}
        {!isUser && sources && sources.length > 0 && <SourceCitations sources={sources} />}
      </div>
    </div>
  );
}
