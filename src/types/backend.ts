// Backend message types
export interface BackendMessage {
  type: 'connected' | 'disconnected' | 'gemini-message' | 'error';
  data?: GeminiMessageData;
  error?: string;
}

export interface GeminiMessageData {
  serverContent?: {
    interrupted?: boolean;
    turnComplete?: boolean;
    modelTurn?: {
      parts: MessagePart[];
    };
  };
}

export interface MessagePart {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string;
  };
}

export interface AudioPart extends MessagePart {
  inlineData: {
    mimeType: string;
    data: string;
  };
}