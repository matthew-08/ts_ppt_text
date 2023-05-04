import * as fs from 'fs';
import { unzip } from 'node:zlib';
import { exec } from 'child_process';
import { stdout } from 'process';
import { XMLParser } from 'fast-xml-parser';
import * as util from 'node:util';
import { dirname } from 'path';
import * as fsPromise from 'fs/promises';
import { setTimeout } from 'timers';

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

  constructor(xml: Buffer | string) {
    this.raw = xml.toString();
    this.textNodes = {};
    this.generateTextNodes();
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
    this.handleEdit(nodeToEdit.text);
  }
  handleEdit(node: string) {}
}

class Presentation {
  slides: Slide[];
  constructor(filePath: string) {
    this.readFile(filePath);
    this.slides = [];
  }
  readFile(filePath: string) {
    fs.readdir('./extract-to/ppt/slides', (err, files) => {
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
      generateFileBuffers().then((res) => {
        res.forEach((buffer) => {
          const slide = new Slide(buffer);
          this.slides.push(slide);
        });
      });
    });
  }
}

const pres = new Presentation('./extract-to');

const temp: Slide[] = [];
setTimeout(() => {
  pres.slides.forEach((slide) => {
    Object.values(slide.textNodes).map((node) => {
      if (node.text === 'Instructions or Question goes here') {
        temp.push(slide);
        console.log(slide.textNodes);
      }
    });
  });
}, 2000);
