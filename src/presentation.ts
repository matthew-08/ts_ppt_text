import { exec } from 'child_process';
import path from 'path';
import { SlideConstructorProps } from './types';
import Slide from './slide';
import prepareSlides from './utils/prepareSlides';
import fs from 'fs/promises';
import sortSlides from './utils/sortSlides';
import handleGenNewPpt from './utils/handleGenNewPpt';
import cwd from './utils/cwd';

export default class Presentation {
  private slides: Slide[];
  private filePath: string;
  private dirName: string;
  private tempDirectory: string;
  private slidesPreparing: Promise<SlideConstructorProps[]> | null;
  private slidesExtracting: Promise<void> | null;
  constructor(filePath: string, dirName: string) {
    this.filePath = filePath;
    this.dirName = dirName;
    this.tempDirectory = `${this.dirName}/_ppt-temp_`;
    this.slidesPreparing = null;
    this.slidesExtracting = null;
    this.slides = [];
  }
  async getSlides() {
    return await Promise.all([
      this.slidesExtracting,
      this.slidesPreparing,
    ]).then((res) => this.slides);
  }
  generateTempFile() {
    const child = exec(
      `sh ./scripts/extract.sh ${this.tempDirectory} ${this.filePath}`,
      {
        cwd: cwd(),
      },
      (err, stdout) => {
        console.log(err);
        console.log(stdout);
      }
    );
    return new Promise((resolve, reject) => {
      return child.on('close', (code) => {
        console.log(code);
        resolve(0);
      });
    });
  }
  private addSlides(preparedSlides: SlideConstructorProps[]) {
    preparedSlides.forEach(({ bufferOrString, slideName }) => {
      const slide = new Slide(bufferOrString, slideName);
      this.slides = [...this.slides, slide];
    });
  }
  private async generateSlides(files: string[]) {
    const filePathsAndNames = files.map((fname) => {
      return {
        fileName: fname,
        filePath: path.resolve(`${this.tempDirectory}/ppt/slides/${fname}`),
      };
    });
    // prepareSlides generates what is needed for the slide class constructor
    this.slidesPreparing = prepareSlides(filePathsAndNames);
    await this.slidesPreparing.then((res) => {
      return this.addSlides(res);
    });
  }
  async extractSlides() {
    this.slidesExtracting = fs
      .readdir(`${this.tempDirectory}/ppt/slides`)
      .then((res) => {
        const filterRels = res.filter((file) => file != '_rels');
        const sortedFiles = sortSlides(filterRels);
        if (sortedFiles) {
          return this.generateSlides(sortedFiles);
        }
      });
  }
  async applySlideChanges() {
    await Promise.all(
      this.slides.map(async (slide) => slide.writeToFile(this.tempDirectory))
    );
  }
  generateNewPPT(outputPath: string) {
    return handleGenNewPpt(
      path.resolve(outputPath),
      path.resolve(`${this.tempDirectory}`)
    );
  }
}
