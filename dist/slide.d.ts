/// <reference types="node" />
export default class Slide {
    raw: string;
    textNodes: {
        [index: string]: {
            text: string;
            id: string;
            startingIndex: number | null;
        };
    };
    slideName: string;
    testStr: string;
    constructor(bufferOrString: Buffer | string, slideName: string);
    generateTextNodes(): void;
    editTextNode(nodeId: string, text: string): void;
    handleEdit(nodeStartingIndex: number, newText: string): void;
    writeToFile(tempDirectory: string): Promise<void>;
}
