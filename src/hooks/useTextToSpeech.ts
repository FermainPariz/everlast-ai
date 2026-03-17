'use client';

import { useCallback, useRef, useState } from 'react';

interface UseTextToSpeechReturn {
  isSpeaking: boolean;
  isLoading: boolean;
  speak: (text: string) => Promise<void>;
  stop: () => void;
}

export function useTextToSpeech(): UseTextToSpeechReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const stop = useCallback(() => {
    // Stop ElevenLabs audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    // Stop browser TTS
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsLoading(false);
  }, []);

  const speakWithBrowserTTS = useCallback((text: string) => {
    if (!window.speechSynthesis) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Try to find a good German voice
    const voices = window.speechSynthesis.getVoices();
    const germanVoice = voices.find(v => v.lang.startsWith('de') && v.name.includes('Google'))
      || voices.find(v => v.lang.startsWith('de'))
      || voices[0];
    if (germanVoice) utterance.voice = germanVoice;

    utterance.onstart = () => {
      setIsLoading(false);
      setIsSpeaking(true);
    };
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsLoading(false);
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  const speak = useCallback(async (text: string) => {
    stop();
    if (!text.trim()) return;
    setIsLoading(true);
    speakWithBrowserTTS(text);
  }, [stop, speakWithBrowserTTS]);

  return { isSpeaking, isLoading, speak, stop };
}
