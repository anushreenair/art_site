import { useEffect, useRef, useState } from 'react';
type Recognition = {
  continuous: boolean; interimResults: boolean; lang: string;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null; onend: (() => void) | null;
  start(): void; stop(): void; abort(): void;
};
type RecognitionConstructor = new () => Recognition;
function constructor() {
  const browser = window as typeof window & { SpeechRecognition?: RecognitionConstructor; webkitSpeechRecognition?: RecognitionConstructor };
  return browser.SpeechRecognition ?? browser.webkitSpeechRecognition;
}
export function useVoiceSearch(onTranscript: (text: string) => void, onSubmit: (text: string) => void) {
  const [listening, setListening] = useState(false);
  const [message, setMessage] = useState('');
  const active = useRef<Recognition | null>(null);
  const callbacks = useRef({ onTranscript, onSubmit });
  callbacks.current = { onTranscript, onSubmit };
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const supported = typeof window !== 'undefined' && Boolean(constructor());
  const cancel = () => {
    clearTimeout(timer.current);
    const recognition = active.current;
    active.current = null;
    if (recognition) { recognition.onresult = recognition.onerror = recognition.onend = null; recognition.abort(); }
    setListening(false);
  };
  useEffect(() => () => {
    clearTimeout(timer.current);
    const recognition = active.current;
    if (recognition) { recognition.onresult = recognition.onerror = recognition.onend = null; recognition.abort(); }
    active.current = null;
  }, []);
  function toggle() {
    if (active.current) { active.current.stop(); return; }
    const Speech = constructor();
    if (!Speech) return;
    setMessage('');
    let transcript = '', failed = false;
    try {
      const recognition = new Speech();
      active.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = navigator.language || 'en-IN';
      recognition.onresult = event => {
        transcript = Array.from(event.results).map(result => result[0]?.transcript ?? '').join(' ').trim().slice(0, 500);
        if (transcript) callbacks.current.onTranscript(transcript);
      };
      recognition.onerror = event => {
        failed = true;
        const messages: Record<string, string> = {
          'not-allowed': 'Microphone permission was denied. You can still type your search.',
          'service-not-allowed': 'Speech recognition permission was denied. You can still type.',
          'no-speech': 'No speech detected. Try again or type your search.',
          'audio-capture': 'No microphone is available. You can still type your search.',
          network: 'Voice recognition could not connect. Try typing your search.',
          aborted: 'Voice search stopped.',
        };
        setMessage(messages[event.error] ?? 'Voice recognition failed. Try again or type your search.');
        setListening(false);
      };
      recognition.onend = () => {
        clearTimeout(timer.current);
        active.current = null;
        setListening(false);
        if (!failed && transcript) callbacks.current.onSubmit(transcript);
        else if (!failed) setMessage('No speech detected. Try again or type your search.');
      };
      recognition.start();
      setListening(true);
      timer.current = setTimeout(() => { cancel(); setMessage('Voice search stopped after 30 seconds. Try again or type.'); }, 30000);
    } catch { cancel(); setMessage('Voice search could not start. Try typing your search.'); }
  }
  return { supported, listening, message, toggle, cancel };
}
