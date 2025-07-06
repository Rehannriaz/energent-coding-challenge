// Audio processing types
export interface AudioWorkletMessage {
  volume: number;
}

export interface AudioWorkletEvent {
  data: AudioWorkletMessage;
}

export interface VolumeEvent extends Event {
  data: {
    volume: number;
  };
}

export interface AudioWorkletNodeOptions {
  numberOfInputs?: number;
  numberOfOutputs?: number;
  outputChannelCount?: number[];
  parameterData?: Record<string, number>;
  processorOptions?: Record<string, unknown>;
}