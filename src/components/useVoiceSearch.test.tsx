import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useVoiceSearch } from './useVoiceSearch';
class Recognition {
  static last: Recognition;
  continuous = true; interimResults = true; lang = '';
  onresult: ((event: unknown) => void) | null = null;
  onerror: ((event: unknown) => void) | null = null;
  onend: (() => void) | null = null;
  start = vi.fn(); stop = vi.fn(); abort = vi.fn();
  constructor() { Recognition.last = this; }
}
afterEach(() => { delete (window as unknown as Record<string, unknown>).SpeechRecognition; });
describe('voice search', () => {
  it('submits only when speech finishes and releases the microphone on unmount', () => {
    Object.assign(window, { SpeechRecognition: Recognition });
    const submit = vi.fn(), transcribe = vi.fn();
    const { result, unmount } = renderHook(() => useVoiceSearch(transcribe, submit));
    act(() => result.current.toggle());
    expect(Recognition.last.continuous).toBe(false);
    act(() => Recognition.last.onresult?.({ results: [[{ transcript: 'draw hands' }]] }));
    expect(submit).not.toHaveBeenCalled();
    expect(transcribe).toHaveBeenCalledWith('draw hands');
    act(() => Recognition.last.onend?.());
    expect(submit).toHaveBeenCalledWith('draw hands');
    act(() => result.current.toggle());
    unmount();
    expect(Recognition.last.abort).toHaveBeenCalled();
    expect(Recognition.last.onend).toBeNull();
  });
  it('stops listening and reports denied permission without searching', () => {
    Object.assign(window, { SpeechRecognition: Recognition });
    const submit = vi.fn();
    const { result } = renderHook(() => useVoiceSearch(vi.fn(), submit));
    act(() => result.current.toggle());
    act(() => result.current.toggle());
    expect(Recognition.last.stop).toHaveBeenCalled();
    act(() => Recognition.last.onerror?.({error: 'not-allowed'}));
    act(() => Recognition.last.onend?.());
    expect(result.current.message).toContain('permission');
    expect(submit).not.toHaveBeenCalled();
  });
});
