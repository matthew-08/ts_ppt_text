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
    private generateTempFile;
    private addSlides;
    private generateSlides;
    private extractSlides;
    applySlideChanges(): void;
    generateNewPPT(outputPath: string): void;
}
