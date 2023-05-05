import { exec } from 'child_process';

const handleGenNewPpt = (outputDir: string, inputDir: string) => {
  exec(
    `sh ./src/scripts/zip.sh ${inputDir} ${outputDir}`,
    (error, stdout, stderr) => {
      if (error || stderr) {
        console.log(error || stderr);
      }
      console.log(stdout);
    }
  );
};

export default handleGenNewPpt;
