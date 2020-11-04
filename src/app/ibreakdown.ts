export interface IBreakdown {
  $schema: "../../schemas/breakdown.json";
  startOffset?: number;
  beatsPerMeasure: number;
  tracks: ITracks;
  sections: ISection[];
}

export type ITracks = (string | ITrack | IGroup)[];

export interface ITrack {
  description: string;
  filename: string;
}

export function isITrack(o: ITrack | IGroup): o is ITrack {
  return (o as ITrack).filename !== undefined;
}

export interface IGroup {
  [name: string]: (string | ITrack)[];
}

export interface ISection {
  description: string;
  framework?: string;
  measures: IMeasures;
}

export type IMeasures = number | (number | string | IMeasure)[];

export interface IMeasure {
  length?: number;
  framework?: string;
  warning?: boolean;
}