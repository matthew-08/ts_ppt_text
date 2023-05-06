import { exec } from 'child_process';
import cwd from './cwd';

const handleGenNewPpt = (outputDir: string, inputDir: string) => {
  exec(
    `sh ./scripts/zip.sh ${inputDir} ${outputDir}`,
    {
      cwd: cwd(),
    },
    (error, stdout, stderr) => {
      if (error || stderr) {
        console.log(error || stderr);
      }
      console.log(stdout);
    }
  );
};

export default handleGenNewPpt;
