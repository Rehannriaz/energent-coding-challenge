Author: Rehannriaz

**For Review By:**
- https://github.com/remi-guan
- https://github.com/lingjiekong  
- https://github.com/goldmermaid
- https://github.com/EnergentAI

# Energent AI - Coding Challenge

A modern, responsive web application inspired by Energent.ai with integrated AI voice chat capabilities. Built with React, TypeScript, Next.js, and Tailwind CSS.

## 🚀 Live Demo

[🔗 View Live Application](https://energent-coding-challenge.vercel.app)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [AI Integration](#ai-integration)
- [Architecture](#architecture)
- [API Routes](#api-routes)
- [Components](#components)
- [Responsive Design](#responsive-design)
- [Performance Optimizations](#performance-optimizations)
- [Browser Compatibility](#browser-compatibility)
- [Acknowledgments](#acknowledgments)

## ✨ Features

### Core Features
- **Modern UI Design**: Inspired by Energent.ai with custom animations and transitions
- **Responsive Layout**: Fully responsive across all device sizes
- **Dark Theme**: Professional dark theme with gradient backgrounds
- **Smooth Animations**: Framer Motion animations throughout the application
- **Type Safety**: Full TypeScript implementation with proper type definitions

### AI Integration Hub
- **Dual AI Provider Support**: Switch between Google Gemini Live API and OpenAI voice chat
- **Real-time Voice Chat**: Natural voice conversations with AI assistants
- **Video Integration**: Webcam integration for Gemini Live API with real-time video streaming
- **Audio Visualization**: Real-time audio level indicators for both input and output
- **Activity Logging**: Comprehensive logging system for debugging and monitoring
- **Provider Switching**: Easy toggle between AI providers with environment variable support

### Sections Implemented
1. **Hero Section**: Dynamic landing area with call-to-action
2. **AI Integration Hub**: Interactive AI voice chat interface
3. **Core Features**: Feature showcase with animations
4. **Applications**: Use case demonstrations
5. **Statistics**: Animated counter displays
6. **Team**: Team member profiles
7. **Subscriptions**: Pricing plans and packages
8. **Reviews**: Customer testimonials
9. **FAQ**: Frequently asked questions
10. **Contact**: Contact form and information

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 15.0.0 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom animations
- **Animations**: Framer Motion
- **UI Components**: Custom components with Radix UI primitives
- **State Management**: React Context API

### AI Integration
- **Google Gemini**: Live API integration with audio/video streaming
- **OpenAI**: Voice chat integration with real-time transcription
- **Audio Processing**: Web Audio API with custom audio worklets
- **Video Processing**: HTML5 Canvas for real-time video frame processing

### Development Tools
- **Linting**: ESLint with TypeScript support
- **Type Checking**: TypeScript compiler
- **Package Manager**: npm
- **Build Tool**: Next.js built-in bundler

## 📁 Project Structure

```
src/
├── app/                     # Next.js App Router
│   ├── api/                 # API Routes
│   │   ├── ai/              # AI integration endpoints
│   │   └── openai-session/  # OpenAI session management
│   ├── globals.css          # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/             # React components
│   ├── providers/          # Context providers
│   │   ├── ai-provider.tsx
│   │   ├── gemini-provider.tsx
│   │   └── motion-provider.tsx
│   ├── sections/           # Page sections
│   │   ├── hero-section.tsx
│   │   ├── ai-integration-hub.tsx
│   │   ├── core-features.tsx
│   │   ├── applications.tsx
│   │   ├── statistics.tsx
│   │   ├── team.tsx
│   │   ├── subscriptions.tsx
│   │   ├── reviews.tsx
│   │   ├── faq.tsx
│   │   └── contact.tsx
│   └── ui/                 # Reusable UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── textarea.tsx
├── contexts/               # React contexts
│   └── gemini-live-context.tsx
├── hooks/                  # Custom hooks
│   ├── use-backend-gemini.ts
│   ├── use-gemini-live.ts
│   ├── use-webcam.ts
│   └── useOpenAIVoiceChat.ts
├── lib/                    # Utility libraries
│   ├── gemini/             # Gemini API utilities
│   │   ├── audio-recorder.ts
│   │   ├── audio-streamer.ts
│   │   ├── backend-client.ts
│   │   ├── genai-live-client.ts
│   │   └── worklets/       # Audio worklets
│   └── utils.ts
├── types/                  # TypeScript definitions
│   ├── ai.ts
│   ├── audio.ts
│   ├── backend.ts
│   ├── gemini.ts
│   └── index.ts
└── utils/                  # Utility functions
    └── audioUtils.ts
```

## 🔧 Installation

1. **Clone the repository**:
```bash
git clone https://github.com/Rehannriaz/energent-coding-challenge.git
cd energent-coding-challenge
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up environment variables** (see below)

4. **Run the development server**:
```bash
npm run dev
```

## 🔐 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Google Gemini Live API
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here

# OpenAI API (optional - for dual provider support)
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here

# Environment selection (optional)
NEXT_PUBLIC_AI_PROVIDER=gemini # or 'openai'
```

### Getting API Keys

1. **Google Gemini API Key**:
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Create a new API key
   - Enable the Gemini Live API

2. **OpenAI API Key** (optional):
   - Visit [OpenAI API Platform](https://platform.openai.com/api-keys)
   - Create a new API key
   - Ensure you have credits for voice chat usage

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## 🤖 AI Integration

### Google Gemini Live API
- **Real-time voice chat** with natural language processing
- **Video streaming** with webcam integration
- **Audio processing** with custom audio worklets
- **Live transcription** and response generation

### OpenAI Voice Chat
- **Real-time voice conversations** with OpenAI's voice models
- **Transcription capabilities** with speech-to-text
- **Natural language responses** with text-to-speech
- **Voice activity detection** for seamless conversations

### Provider Switching
The application supports easy switching between AI providers:
- **Runtime switching**: Toggle between providers in the UI
- **Environment variable control**: Set default provider via `NEXT_PUBLIC_AI_PROVIDER`
- **Fallback support**: Graceful handling when API keys are missing

## 🏗 Architecture

### Component Architecture
- **Modular design** with reusable components
- **Context-based state management** for AI providers
- **Custom hooks** for complex logic abstraction
- **Type-safe interfaces** throughout the application

### AI Integration Pattern
```typescript
// Provider abstraction
interface AIProvider {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  sendMessage(message: string): Promise<void>;
  isConnected: boolean;
}

// Context-based state management
const AIContext = createContext<AIProvider | null>(null);

// Custom hooks for specific providers
const useGeminiLive = () => { /* Gemini-specific logic */ };
const useOpenAIVoiceChat = () => { /* OpenAI-specific logic */ };
```

### Audio Processing Pipeline
1. **Audio Capture**: Web Audio API with MediaDevices
2. **Processing**: Custom audio worklets for real-time processing
3. **Streaming**: Real-time audio data streaming to AI providers
4. **Visualization**: Real-time audio level indicators

## 📡 API Routes

### `/api/ai/route.ts`
- **Purpose**: General AI integration endpoint
- **Methods**: GET, POST
- **Features**: Provider abstraction, error handling

### `/api/openai-session/route.ts`
- **Purpose**: OpenAI session management
- **Methods**: POST
- **Features**: Session creation, authentication, configuration

## 🎨 Components

### Core Components
- **HeroSection**: Landing area with animations
- **AIIntegrationHub**: Main AI interaction interface
- **CoreFeatures**: Feature showcase with hover effects
- **Navigation**: Responsive navigation with smooth scrolling

### UI Components
- **Button**: Customizable button component with variants
- **Card**: Reusable card component with backdrop blur
- **Input/Textarea**: Form components with validation

### Provider Components
- **AIProvider**: Context provider for AI functionality
- **GeminiProvider**: Gemini-specific provider
- **MotionProvider**: Animation configuration provider

## 📱 Responsive Design

### Breakpoints
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### Responsive Features
- **Fluid layouts** with CSS Grid and Flexbox
- **Responsive typography** with clamp() functions
- **Adaptive components** that adjust to screen sizes
- **Touch-friendly interfaces** on mobile devices

### Testing
- Tested across multiple devices and screen sizes
- Cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- Mobile-first approach with progressive enhancement

## ⚡ Performance Optimizations

### Code Splitting
- **Dynamic imports** for heavy AI libraries
- **Route-based splitting** with Next.js App Router
- **Component-level splitting** for better loading

### Asset Optimization
- **Image optimization** with Next.js Image component
- **Font optimization** with system font stacks
- **CSS optimization** with Tailwind CSS purging

### Runtime Performance
- **Memoization** of expensive calculations
- **Debounced inputs** for API calls
- **Lazy loading** of non-critical components
- **Efficient re-renders** with React.memo

## 🔍 Browser Compatibility

### Supported Browsers
- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

### Required Web APIs
- **Web Audio API**: For audio processing
- **MediaDevices API**: For webcam access
- **WebRTC**: For real-time communication
- **WebSockets**: For live AI connections

## 🙏 Acknowledgments

- **Energent.ai**: For the design inspiration
- **Google**: For the Gemini Live API
- **OpenAI**: For the voice chat capabilities
- **Vercel**: For the deployment platform
- **Next.js Team**: For the amazing framework