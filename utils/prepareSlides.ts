import generateFileBuffer from './generateFileBuffer';
const prepareSlides = async (
  fPathAndNames: {
    fileName: string;
    filePath: string;
  }[]
) => {
  return Promise.all(
    fPathAndNames.map(async ({ fileName, filePath }) => {
      return {
        fileBuffer: await generateFileBuffer(filePath),
        fileName: fileName,
      };
    })
  );
};

export default prepareSlides;
