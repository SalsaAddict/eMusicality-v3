import { IBreakdown, ISection } from './ibreakdown';
import { Measures } from './measures';
import { Section } from './section';
import { IStartIndex } from './song';

export class Sections {
  static load(iBreakdown: IBreakdown, startIndex: IStartIndex): Section[] {
    let sections: Section[] = [];
    iBreakdown.sections.forEach((iSection, index, array) => {
      let framework = iSection.framework,
        start = startIndex.startIndex,
        isLast = index === array.length - 1,
        measures = Measures.load(iSection.measures, startIndex, iBreakdown.beatsPerMeasure, framework),
        endIndex = startIndex.startIndex - 1;
      sections.push(new Section(index, iSection.description, measures, start, endIndex, isLast));
    });
    return sections;
  }
}
