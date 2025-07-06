# OpenAI Realtime Voice Chat Integration

This is a clean, minimal implementation of OpenAI's Realtime Voice Chat API extracted from the original codebase. It provides real-time voice interaction with automatic speech detection and AI responses.

## Features

- **Real-time Voice Chat**: Direct WebRTC connection to OpenAI's Realtime API
- **Voice Activity Detection (VAD)**: Automatic speech start/stop detection
- **Live Transcription**: Real-time speech-to-text with delta updates
- **Audio Playback**: Plays back AI responses automatically
- **Connection Management**: Handles connection states and errors
- **TypeScript Support**: Fully typed implementation

## Installation

1. Install required dependencies:

```bash
npm install @openai/agents
```

2. Copy the provided files to your project:
   - `src/hooks/useOpenAIVoiceChat.ts` - Main voice chat hook
   - `src/components/VoiceChatWidget.tsx` - Ready-to-use React component
   - `src/api/openai-session.ts` - API endpoint for session management
   - `src/utils/audioUtils.ts` - Audio utility functions

## Setup

### 1. API Route Setup

**For Next.js App Router:**
Move `src/api/openai-session.ts` to `app/api/openai-session/route.ts`

**For Next.js Pages Router:**
Move `src/api/openai-session.ts` to `pages/api/openai-session.ts`

### 2. Environment Variables

Create a `.env.local` file with your OpenAI API key:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

**Important**: Never expose your OpenAI API key in client-side code. The provided API route handles the key securely on the server.

## Usage

### Basic Usage with the Widget Component

```tsx
import { VoiceChatWidget } from '@/components/VoiceChatWidget';

function MyApp() {
  return (
    <div>
      <VoiceChatWidget
        apiKey={process.env.NEXT_PUBLIC_OPENAI_API_KEY!} // Use your secure method
        instructions="You are a helpful voice assistant."
        voice="alloy"
        onTranscriptUpdate={(transcript, isComplete) => {
          console.log('Transcript:', transcript);
        }}
        onError={(error) => {
          console.error('Voice chat error:', error);
        }}
      />
    </div>
  );
}
```

### Advanced Usage with the Hook

```tsx
import { useOpenAIVoiceChat } from '@/hooks/useOpenAIVoiceChat';

function CustomVoiceChat() {
  const { state, connect, disconnect, sendMessage, interrupt, setMuted } = useOpenAIVoiceChat(
    {
      apiKey: 'your-api-key',
      instructions: 'You are a helpful assistant.',
      voice: 'alloy',
      voiceActivityDetection: {
        threshold: 0.9,
        silenceDurationMs: 500,
        prefixPaddingMs: 300,
      },
    },
    {
      onConnectionChange: (status) => {
        console.log('Status changed:', status);
      },
      onTranscriptUpdate: (transcript, isComplete) => {
        console.log('Transcript update:', transcript);
      },
      onError: (error) => {
        console.error('Error:', error);
      },
    }
  );

  return (
    <div>
      <p>Status: {state.status}</p>
      <p>User Speaking: {state.isUserSpeaking ? 'Yes' : 'No'}</p>
      <p>Assistant Speaking: {state.isAssistantSpeaking ? 'Yes' : 'No'}</p>
      
      <button onClick={connect}>Connect</button>
      <button onClick={disconnect}>Disconnect</button>
      <button onClick={() => sendMessage('Hello!')}>Send Message</button>
      <button onClick={interrupt}>Stop Assistant</button>
      <button onClick={() => setMuted(true)}>Mute</button>
    </div>
  );
}
```

## Configuration Options

### VoiceChatConfig

```typescript
interface VoiceChatConfig {
  apiKey: string;                    // OpenAI API key
  model?: string;                    // Default: 'gpt-4o-realtime-preview-2025-06-03'
  instructions?: string;             // Assistant instructions
  voice?: string;                    // Voice type: 'alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'
  audioFormat?: 'pcm16' | 'g711_ulaw' | 'g711_alaw';
  voiceActivityDetection?: {
    threshold?: number;              // Default: 0.9
    silenceDurationMs?: number;      // Default: 500
    prefixPaddingMs?: number;        // Default: 300
  };
}
```

### Voice Activity Detection Settings

- **threshold**: Sensitivity for detecting speech (0.0 to 1.0)
- **silenceDurationMs**: How long to wait in silence before stopping
- **prefixPaddingMs**: Audio padding before detected speech

## Browser Requirements

- Chrome 66+ (recommended)
- Firefox 60+
- Safari 12+
- Edge 79+

The implementation includes automatic browser compatibility checks.

## Security Notes

1. **Never expose API keys**: Always use server-side API routes
2. **HTTPS Required**: WebRTC requires HTTPS in production
3. **Microphone Permission**: Users must grant microphone access
4. **CORS**: Ensure your API routes have proper CORS configuration

## Troubleshooting

### Common Issues

1. **"Microphone permission denied"**
   - Ensure HTTPS is enabled
   - Check browser permissions
   - User must explicitly grant microphone access

2. **"Failed to connect"**
   - Verify OpenAI API key is valid
   - Check network connectivity
   - Ensure API route is properly configured

3. **"No audio playback"**
   - Check browser autoplay policies
   - Verify audio element is properly created
   - Ensure user has interacted with page (required for autoplay)

### Debug Mode

Enable debug logging by adding this to your component:

```tsx
useEffect(() => {
  // Enable debug logging
  console.log('Voice chat state:', state);
}, [state]);
```

## API Reference

### useOpenAIVoiceChat Hook

**Parameters:**
- `config: VoiceChatConfig` - Configuration object
- `callbacks: VoiceChatCallbacks` - Event callbacks

**Returns:**
- `state: VoiceChatState` - Current state
- `connect: () => Promise<void>` - Connect to voice chat
- `disconnect: () => void` - Disconnect from voice chat
- `sendMessage: (text: string) => void` - Send text message
- `interrupt: () => void` - Stop current AI response
- `setMuted: (muted: boolean) => void` - Mute/unmute audio

### VoiceChatWidget Component

**Props:**
- `apiKey: string` - OpenAI API key
- `className?: string` - CSS classes
- `instructions?: string` - Assistant instructions
- `voice?: string` - Voice type
- `onTranscriptUpdate?: (transcript: string, isComplete: boolean) => void`
- `onError?: (error: string) => void`

## License

This implementation is based on OpenAI's Realtime API and follows their usage guidelines.