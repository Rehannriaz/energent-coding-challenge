import { useCallback, useRef, useState, useEffect } from 'react';
import {
  RealtimeSession,
  RealtimeAgent,
  OpenAIRealtimeWebRTC,
} from '@openai/agents/realtime';
import { audioFormatForCodec, applyCodecPreferences } from '../lib/codecUtils';

export interface VoiceChatConfig {
  apiKey: string;
  model?: string;
  voiceActivityDetection?: {
    threshold?: number;
    silenceDurationMs?: number;
    prefixPaddingMs?: number;
  };
  audioFormat?: 'pcm16' | 'g711_ulaw' | 'g711_alaw';
  instructions?: string;
  voice?: string;
  codec?: 'opus' | 'pcmu' | 'pcma';
  pushToTalk?: boolean;
}

export interface VoiceChatCallbacks {
  onConnectionChange?: (status: 'CONNECTED' | 'CONNECTING' | 'DISCONNECTED') => void;
  onTranscriptUpdate?: (transcript: string, isComplete: boolean) => void;
  onError?: (error: string) => void;
  onEventLogged?: (direction: 'client' | 'server', eventName: string, eventData: any) => void;
}

export interface VoiceChatState {
  status: 'CONNECTED' | 'CONNECTING' | 'DISCONNECTED';
  isUserSpeaking: boolean;
  isAssistantSpeaking: boolean;
  transcript: string;
  isPushToTalkActive: boolean;
  codec: 'opus' | 'pcmu' | 'pcma';
  isAudioPlaybackEnabled: boolean;
}

export function useOpenAIVoiceChat(
  config: VoiceChatConfig,
  callbacks: VoiceChatCallbacks = {}
) {
  const sessionRef = useRef<RealtimeSession | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const callbacksRef = useRef(callbacks);
  
  // Update callbacks ref when callbacks change
  useEffect(() => {
    callbacksRef.current = callbacks;
  }, [callbacks]);
  
  const [state, setState] = useState<VoiceChatState>({
    status: 'DISCONNECTED',
    isUserSpeaking: false,
    isAssistantSpeaking: false,
    transcript: '',
    isPushToTalkActive: false,
    codec: config.codec || 'opus',
    isAudioPlaybackEnabled: true,
  });

  const updateState = useCallback((updates: Partial<VoiceChatState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const updateStatus = useCallback((status: VoiceChatState['status']) => {
    updateState({ status });
    callbacksRef.current.onConnectionChange?.(status);
  }, [updateState]);

  const logEvent = useCallback((direction: 'client' | 'server', eventName: string, eventData: any) => {
    callbacksRef.current.onEventLogged?.(direction, eventName, eventData);
  }, []);

  // Create audio element for playback
  useEffect(() => {
    if (typeof window === 'undefined') {return;}
    
    const audioEl = document.createElement('audio');
    audioEl.autoplay = true;
    audioEl.style.display = 'none';
    document.body.appendChild(audioEl);
    audioElementRef.current = audioEl;

    return () => {
      if (audioEl.parentNode) {
        audioEl.parentNode.removeChild(audioEl);
      }
    };
  }, []);

  // Handle transcript updates
  const handleTranscriptUpdate = useCallback((event: any) => {
    switch (event.type) {
      case 'conversation.item.input_audio_transcription.completed':
        updateState({ transcript: event.transcript });
        callbacksRef.current.onTranscriptUpdate?.(event.transcript, true);
        break;
      case 'response.audio_transcript.delta':
        updateState({ transcript: event.delta });
        callbacksRef.current.onTranscriptUpdate?.(event.delta, false);
        break;
      case 'response.audio_transcript.done':
        updateState({ transcript: event.transcript });
        callbacksRef.current.onTranscriptUpdate?.(event.transcript, true);
        break;
    }
  }, [updateState]);

  // Handle session events
  const handleSessionEvents = useCallback((event: any) => {
    // Log all events for debugging
    logEvent('server', event.type, event);

    switch (event.type) {
      case 'input_audio_buffer.speech_started':
        updateState({ isUserSpeaking: true });
        break;
      case 'input_audio_buffer.speech_stopped':
        updateState({ isUserSpeaking: false });
        break;
      case 'response.audio.delta':
        updateState({ isAssistantSpeaking: true });
        break;
      case 'response.audio.done':
        updateState({ isAssistantSpeaking: false });
        break;
      case 'error':
        callbacksRef.current.onError?.(event.error?.message || 'Unknown error');
        break;
    }
    
    // Handle transcript events
    handleTranscriptUpdate(event);
  }, [callbacks, handleTranscriptUpdate, updateState, logEvent]);

  // Fetch ephemeral key
  const fetchEphemeralKey = useCallback(async (): Promise<string> => {
    const response = await fetch('/api/openai-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey: config.apiKey }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch ephemeral key');
    }

    const data = await response.json();
    return data.client_secret.value;
  }, [config.apiKey]);

  // Connect to OpenAI Realtime API
  const connect = useCallback(async () => {
    if (sessionRef.current) {return;}
    
    updateStatus('CONNECTING');

    try {
      const ephemeralKey = await fetchEphemeralKey();
      
      // Create simple agent with voice instructions using the proper constructor
      const agent = new RealtimeAgent({
        name: 'voice-assistant',
        instructions: config.instructions || 'You are a helpful voice assistant. Respond naturally and conversationally.',
        voice: config.voice || 'alloy',
        tools: [],
        handoffs: [],
        handoffDescription: 'Simple voice assistant',
      });

      const audioFormat = config.audioFormat || audioFormatForCodec(state.codec);
      
      sessionRef.current = new RealtimeSession(agent, {
        transport: new OpenAIRealtimeWebRTC({
          audioElement: audioElementRef.current || undefined,
        }),
        model: config.model || 'gpt-4o-realtime-preview-2025-06-03',
        config: {
          inputAudioFormat: audioFormat,
          outputAudioFormat: audioFormat,
          inputAudioTranscription: {
            model: 'gpt-4o-mini-transcribe',
          },
          turnDetection: config.pushToTalk ? undefined : {
            type: 'server_vad',
            threshold: config.voiceActivityDetection?.threshold || 0.9,
            prefix_padding_ms: config.voiceActivityDetection?.prefixPaddingMs || 300,
            silence_duration_ms: config.voiceActivityDetection?.silenceDurationMs || 500,
            create_response: true,
          },
        },
      });

      // Set up event handlers
      sessionRef.current.on('transport_event', handleSessionEvents);
      sessionRef.current.on('error', (error: any) => {
        callbacksRef.current.onError?.(error.message || 'Session error');
      });

      await sessionRef.current.connect({ apiKey: ephemeralKey });
      
      // Apply codec preferences for WebRTC connection
      if ((sessionRef.current.transport as any).pc && state.codec !== 'opus') {
        applyCodecPreferences((sessionRef.current.transport as any).pc, state.codec);
      }
      
      updateStatus('CONNECTED');
      logEvent('client', 'session.connected', { codec: state.codec, pushToTalk: config.pushToTalk });
    } catch (error) {
      updateStatus('DISCONNECTED');
      callbacksRef.current.onError?.(error instanceof Error ? error.message : 'Connection failed');
    }
  }, [config.apiKey, config.model, config.audioFormat, config.instructions, config.voice, config.pushToTalk, config.voiceActivityDetection?.threshold, config.voiceActivityDetection?.silenceDurationMs, config.voiceActivityDetection?.prefixPaddingMs, state.codec, fetchEphemeralKey, handleSessionEvents, updateStatus, logEvent]);

  // Disconnect from OpenAI
  const disconnect = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    updateStatus('DISCONNECTED');
    updateState({ isUserSpeaking: false, isAssistantSpeaking: false });
  }, [updateStatus, updateState]);

  // Send text message
  const sendMessage = useCallback((text: string) => {
    if (!sessionRef.current) {
      callbacksRef.current.onError?.('Not connected to voice chat');
      return;
    }
    
    sessionRef.current.sendMessage(text);
  }, []);

  // Interrupt current response
  const interrupt = useCallback(() => {
    sessionRef.current?.interrupt();
  }, []);

  // Mute/unmute audio
  const setMuted = useCallback((muted: boolean) => {
    if (audioElementRef.current) {
      audioElementRef.current.muted = muted;
    }
    sessionRef.current?.mute(muted);
  }, []);

  // Push-to-talk functionality
  const pushToTalkStart = useCallback(() => {
    if (!sessionRef.current || !config.pushToTalk) {return;}
    
    updateState({ isPushToTalkActive: true });
    sessionRef.current.transport.sendEvent({ type: 'input_audio_buffer.clear' } as any);
    logEvent('client', 'push_to_talk.started', {});
  }, [config.pushToTalk, updateState, logEvent]);

  const pushToTalkStop = useCallback(() => {
    if (!sessionRef.current || !config.pushToTalk) {return;}
    
    updateState({ isPushToTalkActive: false });
    sessionRef.current.transport.sendEvent({ type: 'input_audio_buffer.commit' } as any);
    sessionRef.current.transport.sendEvent({ type: 'response.create' } as any);
    logEvent('client', 'push_to_talk.stopped', {});
  }, [config.pushToTalk, updateState, logEvent]);

  // Toggle audio playback
  const toggleAudioPlayback = useCallback(() => {
    const newState = !state.isAudioPlaybackEnabled;
    updateState({ isAudioPlaybackEnabled: newState });
    setMuted(!newState);
    logEvent('client', 'audio_playback.toggled', { enabled: newState });
  }, [state.isAudioPlaybackEnabled, updateState, setMuted, logEvent]);

  // Change codec
  const changeCodec = useCallback((newCodec: 'opus' | 'pcmu' | 'pcma') => {
    if (state.status === 'CONNECTED') {
      callbacksRef.current.onError?.('Cannot change codec while connected. Please disconnect first.');
      return;
    }
    updateState({ codec: newCodec });
    logEvent('client', 'codec.changed', { codec: newCodec });
  }, [state.status, updateState, logEvent]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    state,
    connect,
    disconnect,
    sendMessage,
    interrupt,
    setMuted,
    pushToTalkStart,
    pushToTalkStop,
    toggleAudioPlayback,
    changeCodec,
  };
}