export interface IBreakdown {
  $schema: "../../schemas/breakdown.json";
  startOffset?: number;
  beatsPerMeasure: number;
  tracks: (string | ITrack | IGroup)[];
  sections: ISection[];
}

export interface IGroup {
  [name: string]: (string | ITrack)[];
}

export interface ITrack {
  description: string;
  filename: string;
}

export interface ISection {
  description: string;
  framework?: string;
  measures: number | (number | string | IMeasure)[];
}

export interface IMeasure {
  beats?: number;
  framework?: string;
  warning?: boolean;
}