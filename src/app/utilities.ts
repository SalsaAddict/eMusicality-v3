export type IVolume = "off" | "down" | "up";

export interface IRange { startIndex: number; endIndex: number; }

export function inRange(index: number, ...ranges: (IRange | undefined)[]) {
  let result = true;
  for (let i = 0; i < ranges.length; i++)
    if (!(ranges[i] !== undefined && index >= ranges[i]!.startIndex && index <= ranges[i]!.endIndex)) {
      result = false;
      break;
    }
  return result;
}

export function setGain(gainNode: GainNode, value: number, fadeSeconds: number) {
  if (gainNode.gain.value === value) return;
  else if (fadeSeconds === 0 || gainNode.context.state !== "running") gainNode.gain.value = value;
  else gainNode.gain.linearRampToValueAtTime(value, gainNode.context.currentTime + fadeSeconds);
}
