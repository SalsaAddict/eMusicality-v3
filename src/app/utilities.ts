export type IVolume = "off" | "down" | "up";

export function setGain(gainNode: GainNode, value: number, fadeSeconds: number) {
  if (gainNode.gain.value === value) return;
  else if (fadeSeconds === 0 || gainNode.context.state !== "running") gainNode.gain.value = value;
  else gainNode.gain.linearRampToValueAtTime(value, gainNode.context.currentTime + fadeSeconds);
}
