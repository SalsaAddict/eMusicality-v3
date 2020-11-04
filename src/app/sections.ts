import { ISection } from './ibreakdown';
import { Measures } from './measures';
import { Section } from './section';
import { IStartIndex } from './song';

export class Sections {
  static load(iSections: ISection[], startIndex: IStartIndex, beatsPerMeasure: number): Section[] {
    let sections: Section[] = [];
    iSections.forEach((iSection, index, array) => {
      let isLast = index === array.length - 1,
        framework = iSection.framework,
        start = startIndex.startIndex,
        measures = Measures.load(iSection.measures, startIndex, beatsPerMeasure, framework),
        endIndex = startIndex.startIndex - 1;
      sections.push(new Section(index, iSection.description, measures, start, endIndex, isLast));
    });
    return sections;
  }
}
