import generateFileBuffer from './generateFileBuffer';
import type { SlideConstructorProps } from '../../types';
const prepareSlides = async (
  fPathAndNames: {
    fileName: string;
    filePath: string;
  }[]
): Promise<SlideConstructorProps[]> => {
  return Promise.all(
    fPathAndNames.map(async ({ fileName, filePath }) => {
      return {
        bufferOrString: await generateFileBuffer(filePath),
        slideName: fileName,
      };
    })
  );
};

export default prepareSlides;
