import { exec } from 'child_process';
import path from 'path';
import { SlideConstructorProps } from '../types';
import Slide from './slide';
import prepareSlides from './utils/prepareSlides';
import fs from 'fs';
import sortSlides from './utils/sortSlides';
import handleGenNewPpt from './utils/handleGenNewPpt';

export default class Presentation {
  slides: Slide[];
  filePath: string;
  tempDirectory: string;
  constructor(filePath: string) {
    this.filePath = filePath;
    this.tempDirectory = './_ppt-temp_';
    this.generateTempFile();
    this.extractSlides();
    this.slides = [];
  }
  generateTempFile() {
    console.log(this.tempDirectory);
    exec(
      `sh extract.sh ${this.tempDirectory} ${this.filePath}`,
      (error, stdout, stderr) => {
        if (error || stderr) {
          console.log(error || stderr);
        }
        console.log(stdout);
      }
    );
  }
  addSlides(preparedSlides: SlideConstructorProps[]) {
    preparedSlides.forEach(({ bufferOrString, slideName }) => {
      const slide = new Slide(bufferOrString, slideName);
      this.slides = [...this.slides, slide];
    });
  }
  async generateSlides(files: string[]) {
    const filePathsAndNames = files.map((fname) => {
      return {
        fileName: fname,
        filePath: path.resolve(`${this.tempDirectory}/ppt/slides/${fname}`),
      };
    });
    // prepareSlides generates what is needed for the slide class constructor
    const allSlides = await prepareSlides(filePathsAndNames);
    this.addSlides(allSlides);
  }
  extractSlides() {
    fs.readdir(`${this.tempDirectory}/ppt/slides`, (err, files) => {
      const filterRels = files.filter((file) => file != '_rels');
      const sortedFiles = sortSlides(filterRels);
      if (sortedFiles) {
        return this.generateSlides(sortedFiles);
      }
    });
  }
  applySlideChanges() {
    this.slides.forEach((slide) => {
      slide.writeToFile(this.tempDirectory);
    });
  }
  generateNewPPT(outputDir: string) {
    handleGenNewPpt(
      path.resolve(outputDir),
      path.resolve(`${this.tempDirectory}`)
    );
  }
}
