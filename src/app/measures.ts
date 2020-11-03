import { IMeasure } from './ibreakdown';
import { IndexTracker } from './index-tracker';
import { Context, Measure } from './measure';

export class Measures {
  [index: number]: Measure;
  static load(
    iMeasures: number | (number | string | IMeasure)[],
    startIndex: number,
    beatsPerMeasure: number,
    framework: string | undefined): Measures {
    let measures = new Measures();
    if (typeof iMeasures === "number") {
      for (let i = 0; i < iMeasures; i++)
        measures[i] = new Measure(i, startIndex, framework, beatsPerMeasure, "primary", i === iMeasures - 1);
      startIndex += iMeasures * beatsPerMeasure;
    }
    else iMeasures.forEach((iMeasure, index, array) => {
      let isLast: boolean = index === array.length - 1;
      if (typeof iMeasure === "string")
        measures[index] = new Measure(index, startIndex, framework = iMeasure, beatsPerMeasure, "primary", isLast);
      else if (typeof iMeasure === "number") {
        if (iMeasure > 0)
          measures[index] = new Measure(index, startIndex, framework, iMeasure, iMeasure === beatsPerMeasure ? "primary" : "danger", isLast);
        else
          measures[index] = new Measure(index, startIndex, framework, beatsPerMeasure, "warning", isLast);
      }
      else {
        let length = iMeasure.beats ?? beatsPerMeasure,
          context: Context = length !== beatsPerMeasure ? "danger" : iMeasure.warning ? "warning" : "primary";
        framework = iMeasure.framework ?? framework;
        measures[index] = new Measure(index, startIndex, framework, length, context, isLast);
      }
      startIndex += measures[index].length;
    });
    return measures;
  }
}
