import * as fsPromise from 'fs/promises';

const generateFileBuffer = async (filePath: string) => {
  return await fsPromise.readFile(filePath);
};

export default generateFileBuffer;
