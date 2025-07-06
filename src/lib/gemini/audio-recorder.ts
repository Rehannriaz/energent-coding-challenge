import { EventEmitter } from "eventemitter3";

export class AudioRecorder extends EventEmitter {
  private mediaRecorder: MediaRecorder | null = null;
  private stream: MediaStream | null = null;
  private isRecording: boolean = false;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private volumeCallback: ((volume: number) => void) | null = null;

  async start() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      this.setupVolumeAnalysis();
      this.setupMediaRecorder();
      
      this.mediaRecorder!.start(100);
      this.isRecording = true;
      
      this.emit("start");
    } catch (error) {
      console.error("Error starting audio recorder:", error);
      this.emit("error", error);
    }
  }

  private setupVolumeAnalysis() {
    if (!this.stream) return;

    this.audioContext = new AudioContext();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 256;
    
    const source = this.audioContext.createMediaStreamSource(this.stream);
    source.connect(this.analyser);
    
    this.monitorVolume();
  }

  private monitorVolume() {
    if (!this.analyser || !this.isRecording) return;

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    
    const volume = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length / 255;
    this.emit("volume", volume);
    
    if (this.isRecording) {
      requestAnimationFrame(() => this.monitorVolume());
    }
  }

  private setupMediaRecorder() {
    if (!this.stream) return;

    this.mediaRecorder = new MediaRecorder(this.stream, {
      mimeType: "audio/webm",
    });

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.processAudioData(event.data);
      }
    };

    this.mediaRecorder.onerror = (error) => {
      console.error("MediaRecorder error:", error);
      this.emit("error", error);
    };
  }

  private async processAudioData(audioBlob: Blob) {
    try {
      const arrayBuffer = await audioBlob.arrayBuffer();
      const audioBuffer = await this.audioContext!.decodeAudioData(arrayBuffer);
      
      const pcmData = this.convertToPCM16(audioBuffer);
      const base64Data = this.arrayBufferToBase64(pcmData);
      
      this.emit("data", base64Data);
    } catch (error) {
      console.error("Error processing audio data:", error);
    }
  }

  private convertToPCM16(audioBuffer: AudioBuffer): ArrayBuffer {
    const length = audioBuffer.length;
    const pcm16 = new Int16Array(length);
    const floatData = audioBuffer.getChannelData(0);
    
    for (let i = 0; i < length; i++) {
      pcm16[i] = Math.max(-32768, Math.min(32767, floatData[i] * 32768));
    }
    
    return pcm16.buffer;
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  stop() {
    this.isRecording = false;
    
    if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
      this.mediaRecorder.stop();
    }
    
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
    
    if (this.audioContext) {
      this.audioContext.close();
    }
    
    this.emit("stop");
  }

  get recording() {
    return this.isRecording;
  }
}