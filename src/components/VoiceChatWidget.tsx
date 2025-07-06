import React, { useState } from 'react';
import { useOpenAIVoiceChat } from '../hooks/useOpenAIVoiceChat';

interface VoiceChatWidgetProps {
  apiKey: string;
  className?: string;
  instructions?: string;
  voice?: string;
  onTranscriptUpdate?: (transcript: string, isComplete: boolean) => void;
  onError?: (error: string) => void;
}

export function VoiceChatWidget({
  apiKey,
  className = '',
  instructions,
  voice = 'alloy',
  onTranscriptUpdate,
  onError,
}: VoiceChatWidgetProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState('');

  const { state, connect, disconnect, sendMessage, interrupt, setMuted } = useOpenAIVoiceChat(
    {
      apiKey,
      instructions,
      voice,
      voiceActivityDetection: {
        threshold: 0.9,
        silenceDurationMs: 500,
        prefixPaddingMs: 300,
      },
    },
    {
      onConnectionChange: (status) => {
        console.log('Voice chat status:', status);
      },
      onTranscriptUpdate: (newTranscript, isComplete) => {
        setTranscript(newTranscript);
        onTranscriptUpdate?.(newTranscript, isComplete);
      },
      onError: (error) => {
        console.error('Voice chat error:', error);
        onError?.(error);
      },
    }
  );

  const handleToggleConnection = () => {
    if (state.status === 'CONNECTED') {
      disconnect();
    } else {
      connect();
    }
  };

  const handleToggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    setMuted(newMuted);
  };

  const getStatusColor = () => {
    switch (state.status) {
      case 'CONNECTED':
        return 'bg-green-500';
      case 'CONNECTING':
        return 'bg-yellow-500';
      case 'DISCONNECTED':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (state.status) {
      case 'CONNECTED':
        return 'Connected';
      case 'CONNECTING':
        return 'Connecting...';
      case 'DISCONNECTED':
        return 'Disconnected';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className={`p-6 bg-white rounded-lg shadow-lg border ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Voice Chat Assistant</h3>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
          <span className="text-sm text-gray-600">{getStatusText()}</span>
        </div>
      </div>

      {/* Audio Activity Indicators */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            state.isUserSpeaking ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'
          }`}></div>
          <span className="text-sm text-gray-600">You</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            state.isAssistantSpeaking ? 'bg-green-500 animate-pulse' : 'bg-gray-300'
          }`}></div>
          <span className="text-sm text-gray-600">Assistant</span>
        </div>
      </div>

      {/* Transcript Display */}
      {transcript && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
          <p className="text-sm text-gray-700">{transcript}</p>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center space-x-3">
        <button
          onClick={handleToggleConnection}
          disabled={state.status === 'CONNECTING'}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            state.status === 'CONNECTED'
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
          } ${
            state.status === 'CONNECTING' ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {state.status === 'CONNECTED' ? 'Disconnect' : 'Connect'}
        </button>

        {state.status === 'CONNECTED' && (
          <>
            <button
              onClick={handleToggleMute}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isMuted
                  ? 'bg-gray-500 hover:bg-gray-600 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {isMuted ? 'Unmute' : 'Mute'}
            </button>

            <button
              onClick={interrupt}
              className="px-4 py-2 rounded-lg font-medium bg-orange-500 hover:bg-orange-600 text-white transition-colors"
            >
              Stop
            </button>
          </>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-4 text-xs text-gray-500">
        <p>• Click "Connect" to start voice chat</p>
        <p>• Speak naturally - the AI will respond automatically</p>
        <p>• Use "Stop" to interrupt the AI response</p>
        <p>• Voice activity detection handles start/stop automatically</p>
      </div>
    </div>
  );
}