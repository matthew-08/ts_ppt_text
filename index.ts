import * as fs from 'fs';
import { unzip } from 'node:zlib';
import { exec } from 'child_process';
import { stdout } from 'process';
import { XMLParser } from 'fast-xml-parser';
import * as util from 'node:util';
import { dirname } from 'path';
import * as fsPromise from 'fs/promises';
import { setTimeout } from 'timers';
import sortSlides from './utils/sortSlides';
import * as path from 'path';
import generateFileBuffer from './utils/generateFileBuffer';
import prepareSlides from './utils/prepareSlides';
import { SlideConstructorProps } from './types';
import { error } from 'console';

const xmlParser = new XMLParser({
  ignoreAttributes: false,
});
const options = {};

exec('sh extract.sh', (error, stdout, stderr) => {
  if (error || stderr) {
    console.log(error || stderr);
  }
  console.log(stdout);
});
/* fs.readFile('./extract-to/ppt/slides/slide2.xml', (err, buffer) => {
  const xml = buffer.toString();

  const ok: any = xmlParser.parse(xml);

  const results = xml.matchAll(/<a:p>.+?<\/a:p>/g);
  let counter = 1;
  const obj: {
    [index: string]: string;
  } = {};
  for (const result of results) {
    const test = result[0];
    const textNodes = test.matchAll(/(?<=<a:t>).+?(?=<\/a:t>)/g);
    for (const node of textNodes) {
      console.log(node[0]);
      obj[`textNode-${counter}`] = node[0];
      counter++;
    }
    console.log(obj);
  }
});
 */
/* fs.readdir('./extract-to/ppt/slides', (err, files) => {
  const filterRels = files.filter((file) => file != '_rels');
  const sorted = filterRels.sort((a, b) => {
    a = a.replace('slide', '').replace('.xml', '');
    b = b.replace('slide', '').replace('.xml', '');
    if (+a > +b) return 1;
    else if (+a < +b) return -1;
    else return 0;
  });
  const resultArray: Slide[] = [];
  const generateFileBuffers = async () => {
    return await Promise.all(
      sorted.map((file) =>
        fsPromise.readFile(`./extract-to/ppt/slides/${file}`)
      )
    );
  };
  generateFileBuffers()
    .then((res) => {
      res.forEach((buffer) => {
        const slide = new Slide(buffer);
        resultArray.push(slide);
      });
    })
    .then((res) => console.log(resultArray[3].textNodes));
});
 */
class Slide {
  raw;
  textNodes: {
    [index: string]: {
      text: string;
      id: string;
      startingIndex: number | null;
    };
  };
  slideName;
  testStr;

  constructor(bufferOrString: Buffer | string, slideName: string) {
    this.raw = bufferOrString.toString();
    this.textNodes = {};
    this.generateTextNodes();
    this.slideName = slideName;
    this.testStr = '';
  }

  generateTextNodes() {
    const extractParagraphs = this.raw.matchAll(/<a:p>.+?<\/a:p>/g);
    const storeResults: typeof this.textNodes = {};
    let counter = 1;
    for (const paragraphMatches of extractParagraphs) {
      const resultText = paragraphMatches[0];
      const textNodes = resultText.matchAll(/(?<=<a:t>).+?(?=<\/a:t>)/g);
      for (const node of textNodes) {
        const getIndex = () => {
          if (node.index && paragraphMatches.index) {
            return node.index + paragraphMatches.index;
          }
          return null;
        };
        storeResults[`textNode-${counter}`] = {
          text: node[0],
          id: String(counter),
          startingIndex: getIndex(),
        };
        counter++;
      }
      this.textNodes = storeResults;
    }
  }
  editTextNode(nodeId: string, text: string) {
    const nodeToEdit = this.textNodes[`textNode-${nodeId}`];
    if (!nodeToEdit) {
      throw new Error("Node doesn't exist");
    }
    if (!nodeToEdit.startingIndex) {
      throw new Error('Invalid node index');
    }
    this.handleEdit(nodeToEdit.startingIndex, text);
  }
  handleEdit(nodeStartingIndex: number, newText: string) {
    let string = '';
    const endingRegex = /<\/a:t>/g;
    endingRegex.lastIndex = nodeStartingIndex;
    const endOfString = endingRegex.exec(this.raw)
      ?.index as RegExpExecArray['index'];
    console.log(this.raw[endOfString]);
    const test =
      this.raw.substring(nodeStartingIndex, 0) +
      newText +
      this.raw.substring(endOfString);
    this.raw = test;
    this.generateTextNodes();
  }
}
class Presentation {
  slides: Slide[];
  constructor(filePath: string) {
    this.extractSlides(filePath);
    this.slides = [];
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
        filePath: `./extract-to/ppt/slides/${fname}`,
      };
    });
    // prepareSlides generates what is needed for the slide class constructor
    const allSlides = await prepareSlides(filePathsAndNames);
    this.addSlides(allSlides);
  }
  extractSlides(directoryPath: string) {
    fs.readdir('./extract-to/ppt/slides', (err, files) => {
      const filterRels = files.filter((file) => file != '_rels');
      const sortedFiles = sortSlides(filterRels);
      if (sortedFiles) {
        return this.generateSlides(sortedFiles);
      }
      const resultArray: Slide[] = [];
    });
  }
}

const pres = new Presentation('./extract-to');

const temp: Slide[] = [];
setTimeout(() => {
  pres.slides.forEach((slide, index) => {
    Object.values(slide.textNodes).map((node) => {
      if (node.text === 'Instructions or Question goes here') {
        temp.push(pres.slides[index]);
      }
    });
  });
  temp.forEach((slide, index) => {
    slide.editTextNode('1', 'THIS IS A QUESTION');
    slide.editTextNode('2', 'THIS IS AN ADDITIONAL INFO SECTION');
    slide.editTextNode('3', 'THIS IS AN ANSWER');
    fs.writeFile(`./testFiles/slide-${index}`, slide.raw, {}, () => {});
  });
}, 2000);

console.log(path.resolve('./extract-to/ppt/'));
