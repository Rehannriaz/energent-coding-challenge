export class AudioStreamer {
  private audioContext: AudioContext;
  private workletNodes: Map<string, AudioWorkletNode> = new Map();
  private nextPlayTime: number = 0;
  private isPlaying: boolean = false;

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
  }

  async addWorklet<T>(
    name: string,
    workletUrl: string,
    onMessage?: (event: MessageEvent<T>) => void
  ): Promise<AudioWorkletNode> {
    try {
      await this.audioContext.audioWorklet.addModule(workletUrl);
      const workletNode = new AudioWorkletNode(this.audioContext, name);
      
      if (onMessage) {
        workletNode.port.onmessage = onMessage;
      }
      
      this.workletNodes.set(name, workletNode);
      return workletNode;
    } catch (error) {
      console.error(`Failed to add worklet ${name}:`, error);
      throw error;
    }
  }

  addPCM16(pcmData: Uint8Array) {
    if (pcmData.length === 0) return;

    const samples = new Int16Array(pcmData.buffer);
    const floatSamples = new Float32Array(samples.length);
    
    for (let i = 0; i < samples.length; i++) {
      floatSamples[i] = samples[i] / 32768.0;
    }

    const audioBuffer = this.audioContext.createBuffer(
      1,
      floatSamples.length,
      16000
    );
    audioBuffer.copyToChannel(floatSamples, 0);

    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.audioContext.destination);

    const currentTime = this.audioContext.currentTime;
    if (this.nextPlayTime <= currentTime) {
      this.nextPlayTime = currentTime;
    }

    source.start(this.nextPlayTime);
    this.nextPlayTime += audioBuffer.duration;
    this.isPlaying = true;

    source.onended = () => {
      if (this.nextPlayTime <= this.audioContext.currentTime + 0.1) {
        this.isPlaying = false;
      }
    };
  }

  stop() {
    this.isPlaying = false;
    this.nextPlayTime = 0;
    this.workletNodes.clear();
  }

  get playing() {
    return this.isPlaying;
  }
}