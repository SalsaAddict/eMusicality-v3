import { IMeasures } from './ibreakdown';
import { Context, Measure } from './measure';
import { IStartIndex } from './song';

export class Measures {
  static load(iMeasures: IMeasures, startIndex: IStartIndex, beatsPerMeasure: number, framework?: string): Measure[] {
    let measures: Measure[] = [];
    if (typeof iMeasures === "number")
      for (let i = 0; i < iMeasures; i++)
        measures.push(new Measure(i, startIndex, framework, beatsPerMeasure, "primary", i === iMeasures - 1));
    else iMeasures.forEach((iMeasure, index, array) => {
      let length: number = beatsPerMeasure,
        context: Context = "primary",
        isLast: boolean = index === array.length - 1;
      if (typeof iMeasure === "string")
        framework = iMeasure;
      else if (typeof iMeasure === "number") {
        if (iMeasure > 0) length = iMeasure;
        else if (iMeasure < 0) context = "warning";
      }
      else {
        framework = iMeasure.framework ?? framework;
        length = iMeasure.length ?? beatsPerMeasure;
        if (iMeasure.warning) context = "warning";
      }
      if (length !== beatsPerMeasure) context = "danger";
      measures.push(new Measure(index, startIndex, framework, length, context, isLast));
    });
    return measures;
  }
}
