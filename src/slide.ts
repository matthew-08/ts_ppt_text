import replaceXMLText from './utils/replaceXMLText';
import path from 'path';
import * as fs from 'fs/promises';

export default class Slide {
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
    const endingRegex = /<\/a:t>/g;
    endingRegex.lastIndex = nodeStartingIndex;
    const endOfString = endingRegex.exec(this.raw)
      ?.index as RegExpExecArray['index'];
    this.raw = replaceXMLText(
      {
        startIndex: nodeStartingIndex,
        endIndex: endOfString,
      },
      newText,
      this.raw
    );
    this.generateTextNodes();
  }
  async writeToFile(tempDirectory: string) {
    return await fs.writeFile(
      path.resolve(`${tempDirectory}/ppt/slides/${this.slideName}`),
      this.raw,
    );
  }
}
