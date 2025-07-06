export function audioFormatForCodec(codec: string): 'pcm16' | 'g711_ulaw' | 'g711_alaw' {
  let audioFormat: 'pcm16' | 'g711_ulaw' | 'g711_alaw' = 'pcm16';
  if (typeof window !== 'undefined') {
    const c = codec.toLowerCase();
    if (c === 'pcmu') {audioFormat = 'g711_ulaw';}
    else if (c === 'pcma') {audioFormat = 'g711_alaw';}
  }
  return audioFormat;
}

export function applyCodecPreferences(pc: RTCPeerConnection, codec: string): void {
  try {
    const caps = (RTCRtpSender as any).getCapabilities?.('audio');
    if (!caps) {return;}
    
    const pref = caps.codecs.find(
      (c: any) => c.mimeType.toLowerCase() === `audio/${codec.toLowerCase()}`,
    );
    if (!pref) {return;}
    
    pc.getTransceivers()
      .filter((t) => t.sender && t.sender.track?.kind === 'audio')
      .forEach((t) => t.setCodecPreferences([pref]));
  } catch (err) {
    console.error('[codecUtils] applyCodecPreferences error', err);
  }
}

export const CODEC_OPTIONS = [
  { value: 'opus', label: 'Opus (48 kHz)' },
  { value: 'pcmu', label: 'PCMU (8 kHz)' },
  { value: 'pcma', label: 'PCMA (8 kHz)' },
] as const;