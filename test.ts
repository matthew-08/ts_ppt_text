import * as fs from 'fs';

fs.readFile('./extract-to/ppt/slides/slide5.xml', (err, result) => {
  const str = result.toString();
  const match = str.match(/Additional text/);
  console.log(match?.index);
});

// Match index is at 2766
