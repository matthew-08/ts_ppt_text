import Slide from './slide';
export default class Presentation {
    private slides;
    private filePath;
    private dirName;
    private tempDirectory;
    private slidesPreparing;
    private slidesExtracting;
    constructor(filePath: string, dirName: string);
    getSlides(): Promise<Slide[]>;
    generateTempFile(): Promise<unknown>;
    private addSlides;
    private generateSlides;
    extractSlides(): Promise<void>;
    applySlideChanges(): Promise<void>;
    generateNewPPT(outputPath: string): Promise<unknown>;
}
