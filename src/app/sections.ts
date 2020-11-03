import { ISection } from './ibreakdown';
import { IndexTracker } from './index-tracker';
import { Measures } from './measures';
import { Section } from './section';

export class Sections {
  [index: number]: Section;
  static load(iSections: ISection[], beatsPerMeasure: number, startIndex: number): Sections {
    let sections = new Sections();
    iSections.forEach((iSection, index, array) => {
      let isLast = index === array.length - 1,
        framework = iSection.framework,
        measures = Measures.load(iSection.measures, startIndex, beatsPerMeasure, framework),
        endIndex = startIndex - 1;
      sections[index] = new Section(index, iSection.description, measures, startIndex, endIndex, isLast);
    });
    return sections;
  }
}
