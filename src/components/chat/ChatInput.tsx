'use client';

import { FormEvent, KeyboardEvent, forwardRef, useEffect, useRef, useState } from 'react';
import { ArrowUp, Mic, MicOff, Square } from 'lucide-react';

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  isListening?: boolean;
  isVoiceSupported?: boolean;
  placeholder?: string;
  onChange: (value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onToggleVoice?: () => void;
}

const ChatInput = forwardRef<HTMLFormElement, ChatInputProps>(
  (
    {
      input,
      isLoading,
      isListening = false,
      isVoiceSupported = false,
      placeholder = 'Stelle eine Frage…',
      onChange,
      onSubmit,
      onToggleVoice,
    },
    ref
  ) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [focused, setFocused] = useState(false);

    useEffect(() => {
      if (!input && textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }, [input]);

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (input.trim() && !isLoading) {
          const form = textareaRef.current?.closest('form');
          form?.requestSubmit();
        }
      }
    };

    return (
      <form
        ref={ref}
        onSubmit={onSubmit}
        className="flex items-end gap-2 px-4 pt-3 pb-4"
        style={{
          borderTop: '1px solid var(--border)',
          background: 'rgba(8,10,15,0.92)',
          backdropFilter: 'blur(10px)',
        }}
      >
        {/* Voice input button */}
        {isVoiceSupported && (
          <button
            type="button"
            onClick={onToggleVoice}
            disabled={isLoading}
            aria-label={isListening ? 'Aufnahme stoppen' : 'Spracheingabe starten'}
            className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 disabled:opacity-30"
            style={{
              background: isListening
                ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                : 'var(--bg-surface)',
              border: isListening ? 'none' : '1px solid var(--border)',
              color: isListening ? '#fff' : 'var(--text-secondary)',
            }}
          >
            {isListening ? (
              <Square size={14} fill="currentColor" />
            ) : (
              <Mic size={16} strokeWidth={2} />
            )}
          </button>
        )}

        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={isListening ? 'Ich höre zu…' : placeholder}
          rows={1}
          disabled={isLoading}
          className="flex-1 resize-none rounded-xl px-4 py-3 text-sm disabled:opacity-50 min-h-[46px] max-h-32 overflow-y-auto focus-visible:outline-none"
          style={{
            background: isListening ? 'rgba(239, 68, 68, 0.06)' : 'var(--bg-surface)',
            border: isListening
              ? '1px solid rgba(239, 68, 68, 0.4)'
              : focused
                ? '1px solid rgba(34,211,238,0.4)'
                : '1px solid var(--border)',
            boxShadow: isListening
              ? '0 0 0 1px rgba(239,68,68,0.1), 0 0 20px rgba(239,68,68,0.05)'
              : focused
                ? '0 0 0 1px rgba(34,211,238,0.1), 0 0 20px rgba(34,211,238,0.05)'
                : 'none',
            color: 'var(--text-primary)',
            transition: 'border-color 0.15s, box-shadow 0.15s, background 0.15s',
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
          }}
        />

        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          aria-label="Nachricht senden"
          className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            background: 'linear-gradient(135deg, #22d3ee 0%, #0891b2 100%)',
            color: '#000',
          }}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
          ) : (
            <ArrowUp aria-hidden="true" size={16} strokeWidth={2.5} />
          )}
        </button>
      </form>
    );
  }
);

ChatInput.displayName = 'ChatInput';

export default ChatInput;
