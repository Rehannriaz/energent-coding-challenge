// AI model and response types
export interface ModelTurnPart {
  text?: string;
  content?: string;
}

export interface ModelTurn {
  parts: ModelTurnPart[];
}

export interface AIContentData {
  modelTurn?: ModelTurn;
  content?: string;
  type?: string;
}

export interface AIMessage {
  role: "user" | "assistant";
  content: string;
}

export interface TextLog {
  timestamp: Date;
  type: string;
  message: string;
}

export type AIProvider = "gemini" | "openai";