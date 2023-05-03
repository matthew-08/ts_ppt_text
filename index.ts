import * as fs from 'fs';
import { unzip } from 'node:zlib';
import { exec } from 'child_process';
import { stdout } from 'process';

exec('sh extract.sh', (error, stdout, stderr) => {
  if (error || stderr) {
    console.log(error || stderr);
  }
  console.log(stdout);
});
