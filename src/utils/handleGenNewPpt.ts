import { exec } from 'child_process';
import cwd from './cwd';

const handleGenNewPpt = (outputDir: string, inputDir: string) => {
  const child = exec(
    `sh ./scripts/zip.sh ${inputDir} ${outputDir}`,
    {
      cwd: cwd(),
    },
    (err) => {
      console.log(err);
    }
  );
  return new Promise((resolve) => {
    child.on('close', resolve);
  });
};

export default handleGenNewPpt;
