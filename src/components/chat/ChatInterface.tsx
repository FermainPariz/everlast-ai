'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { Sparkles, DollarSign, Zap, Puzzle, MessageCircle } from 'lucide-react';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import type { SourceCitation } from '@/types';

interface ChatInterfaceProps {
  workspaceSlug: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: SourceCitation[];
}

let msgCounter = 0;
const nextId = () => `msg-${++msgCounter}`;

const SUGGESTIONS: Record<string, { text: string; icon: typeof MessageCircle }[]> = {
  default: [
    { text: 'Was ist Everlast AI?', icon: MessageCircle },
    { text: 'Wie funktioniert die RAG-Engine?', icon: Zap },
    { text: 'Was kosten die Tarife?', icon: DollarSign },
    { text: 'Welche Integrationen gibt es?', icon: Puzzle },
  ],
  demo: [
    { text: 'Was bietet die Enterprise Edition?', icon: Zap },
    { text: 'Wie migriere ich von Notion zu Everlast AI?', icon: Puzzle },
    { text: 'Was ist neu in API Version 2.1?', icon: MessageCircle },
    { text: 'Welche SLA-Garantien gibt es?', icon: DollarSign },
  ],
  ki: [
    { text: 'Was ist der Unterschied zwischen ML und Deep Learning?', icon: Zap },
    { text: 'Wie funktionieren große Sprachmodelle (LLMs)?', icon: MessageCircle },
    { text: 'Was ist das Alignment-Problem?', icon: Puzzle },
    { text: 'Welche KI-Risiken gibt es für den Arbeitsmarkt?', icon: DollarSign },
  ],
};

const DEFAULT_SUGGESTIONS = SUGGESTIONS.default;

const WORKSPACE_META: Record<string, { title: string; description: string; placeholder: string }> = {
  default: {
    title: 'Wie kann ich helfen?',
    description: 'Stelle mir Fragen zu Everlast AI — Preise, Features, Integrationen, wie die RAG-Engine funktioniert und vieles mehr.',
    placeholder: 'Stelle eine Frage zu Everlast AI…',
  },
  demo: {
    title: 'Enterprise & Migration',
    description: 'Fragen zur Enterprise Edition, Migrationsanleitungen und API-Changelog — alles aus der Demo-Wissensbasis.',
    placeholder: 'Stelle eine Frage zum Demo-Workspace…',
  },
  ki: {
    title: 'KI-Wissensbasis',
    description: 'Stelle Fragen zu Künstlicher Intelligenz — Machine Learning, Deep Learning, LLMs, Ethik, Zukunft und vieles mehr.',
    placeholder: 'Stelle eine Frage zur KI-Wissensbasis…',
  },
};

export default function ChatInterface({ workspaceSlug }: ChatInterfaceProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const question = input.trim();
    if (!question || isLoading) return;

    setInput('');
    const userMsg: ChatMessage = { id: nextId(), role: 'user', content: question };
    const assistantId = nextId();
    const assistantMsg: ChatMessage = { id: assistantId, role: 'assistant', content: '' };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, workspaceSlug }),
      });

      if (!res.ok) throw new Error('Anfrage fehlgeschlagen');

      const sourcesHeader = res.headers.get('x-sources');
      const sources: SourceCitation[] = sourcesHeader ? JSON.parse(decodeURIComponent(sourcesHeader)) : [];

      const reader = res.body?.getReader();
      if (!reader) throw new Error('Keine Antwort erhalten');

      const decoder = new TextDecoder();
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullContent += decoder.decode(value, { stream: true });
        const captured = fullContent;
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: captured } : m))
        );
      }

      setMessages((prev) =>
        prev.map((m) => (m.id === assistantId ? { ...m, sources } : m))
      );
    } catch (err) {
      console.error(err);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: 'Es ist ein Fehler aufgetreten. Bitte versuche es erneut.' }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (pendingSubmit && input) {
      formRef.current?.requestSubmit();
      setPendingSubmit(false);
    }
  }, [input, pendingSubmit]);

  function handleSuggestionClick(text: string) {
    if (isLoading) return;
    setInput(text);
    setPendingSubmit(true);
  }

  const isEmpty = messages.length === 0;
  const suggestions = SUGGESTIONS[workspaceSlug] ?? DEFAULT_SUGGESTIONS;
  const meta = WORKSPACE_META[workspaceSlug] ?? WORKSPACE_META.default;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-8 animate-fade-in-up">
            <div
              className="logo-pulse w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
              style={{
                background: 'linear-gradient(135deg, #22d3ee 0%, #0891b2 100%)',
                boxShadow: '0 0 40px rgba(34, 211, 238, 0.2)',
              }}
            >
              <Sparkles aria-hidden="true" size={28} className="text-black" strokeWidth={2} />
            </div>

            <h2
              className="text-2xl font-semibold mb-3"
              style={{ color: 'var(--text-primary)', textWrap: 'balance' } as React.CSSProperties}
            >
              {meta.title}
            </h2>
            <p className="text-sm max-w-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {meta.description}
            </p>

            <div className="mt-8 grid grid-cols-1 gap-2.5 w-full max-w-sm">
              {suggestions.map(({ text, icon: Icon }) => (
                <button
                  key={text}
                  onClick={() => handleSuggestionClick(text)}
                  disabled={isLoading}
                  className="text-left text-sm px-4 py-3 rounded-xl flex items-center gap-3 transition-all duration-200 disabled:opacity-40"
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    color: 'var(--text-secondary)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.border = '1px solid rgba(34, 211, 238, 0.3)';
                    e.currentTarget.style.background = 'rgba(34, 211, 238, 0.06)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.border = '1px solid rgba(255,255,255,0.07)';
                    e.currentTarget.style.background = 'var(--bg-surface)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  <Icon aria-hidden="true" size={15} className="text-cyan-400 flex-shrink-0" />
                  {text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} sources={message.sources} />
            ))}
            {isLoading && messages.at(-1)?.role === 'assistant' && !messages.at(-1)?.content && (
              <div className="flex justify-start mb-4">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #22d3ee 0%, #0891b2 100%)' }}
                >
                  <Sparkles aria-hidden="true" size={12} className="text-black" strokeWidth={2.5} />
                </div>
                <div
                  className="rounded-2xl rounded-bl-sm px-4 py-3"
                  style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
                >
                  <div className="flex gap-1.5 items-center h-4">
                    {[0, 150, 300].map((delay) => (
                      <div
                        key={delay}
                        className="w-1.5 h-1.5 rounded-full animate-bounce"
                        style={{ backgroundColor: '#22d3ee', animationDelay: `${delay}ms` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      <ChatInput
        ref={formRef}
        input={input}
        isLoading={isLoading}
        placeholder={meta.placeholder}
        onChange={setInput}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
