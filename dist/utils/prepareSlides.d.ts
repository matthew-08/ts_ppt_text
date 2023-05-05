import type { SlideConstructorProps } from '../types';
declare const prepareSlides: (fPathAndNames: {
    fileName: string;
    filePath: string;
}[]) => Promise<SlideConstructorProps[]>;
export default prepareSlides;
