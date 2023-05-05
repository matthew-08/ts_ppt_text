import { exec } from 'child_process';
import path from 'path';
import { SlideConstructorProps } from './types';
import Slide from './slide';
import prepareSlides from './utils/prepareSlides';
import fs from 'fs/promises';
import sortSlides from './utils/sortSlides';
import handleGenNewPpt from './utils/handleGenNewPpt';

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
    this.generateTempFile();
    this.slidesPreparing = null;
    this.slidesExtracting = null;
    this.extractSlides();
    this.slides = [];
  }
  async getSlides() {
    return await Promise.all([
      this.slidesExtracting,
      this.slidesPreparing,
    ]).then((res) => this.slides);
  }
  private generateTempFile() {
    exec(
      `sh ./scripts/extract.sh ${this.tempDirectory} ${this.filePath}`,
      {
        cwd: path.join(process.cwd(), 'node_modules', 'ts_ppt_text', 'dist'),
      },
      (error, stdout, stderr) => {
        if (error || stderr) {
          console.log(error || stderr);
        }
        console.log(stdout);
      }
    );
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
  private extractSlides() {
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
  applySlideChanges() {
    this.slides.forEach((slide) => {
      slide.writeToFile(this.tempDirectory);
    });
  }
  generateNewPPT(outputPath: string) {
    handleGenNewPpt(
      path.resolve(outputPath),
      path.resolve(`${this.tempDirectory}`)
    );
  }
}
