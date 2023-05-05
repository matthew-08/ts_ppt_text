"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const replaceXMLText_1 = __importDefault(require("./utils/replaceXMLText"));
const path_1 = __importDefault(require("path"));
const fs = __importStar(require("fs"));
class Slide {
    constructor(bufferOrString, slideName) {
        this.raw = bufferOrString.toString();
        this.textNodes = {};
        this.generateTextNodes();
        this.slideName = slideName;
        this.testStr = '';
    }
    generateTextNodes() {
        const extractParagraphs = this.raw.matchAll(/<a:p>.+?<\/a:p>/g);
        const storeResults = {};
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
    editTextNode(nodeId, text) {
        const nodeToEdit = this.textNodes[`textNode-${nodeId}`];
        if (!nodeToEdit) {
            throw new Error("Node doesn't exist");
        }
        if (!nodeToEdit.startingIndex) {
            throw new Error('Invalid node index');
        }
        this.handleEdit(nodeToEdit.startingIndex, text);
    }
    handleEdit(nodeStartingIndex, newText) {
        var _a;
        const endingRegex = /<\/a:t>/g;
        endingRegex.lastIndex = nodeStartingIndex;
        const endOfString = (_a = endingRegex.exec(this.raw)) === null || _a === void 0 ? void 0 : _a.index;
        this.raw = (0, replaceXMLText_1.default)({
            startIndex: nodeStartingIndex,
            endIndex: endOfString,
        }, newText, this.raw);
        this.generateTextNodes();
    }
    writeToFile(tempDirectory) {
        return fs.writeFile(path_1.default.resolve(`${tempDirectory}/ppt/slides/${this.slideName}`), this.raw, {}, () => { });
    }
}
exports.default = Slide;
