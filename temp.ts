/* fs.readFile('./extract-to/ppt/slides/slide2.xml', (err, buffer) => {
  const xml = buffer.toString();

  const ok: any = xmlParser.parse(xml);

  const results = xml.matchAll(/<a:p>.+?<\/a:p>/g);
  let counter = 1;
  const obj: {
    [index: string]: string;
  } = {};
  for (const result of results) {
    const test = result[0];
    const textNodes = test.matchAll(/(?<=<a:t>).+?(?=<\/a:t>)/g);
    for (const node of textNodes) {
      console.log(node[0]);
      obj[`textNode-${counter}`] = node[0];
      counter++;
    }
    console.log(obj);
  }
});
 */
/* fs.readdir('./extract-to/ppt/slides', (err, files) => {
  const filterRels = files.filter((file) => file != '_rels');
  const sorted = filterRels.sort((a, b) => {
    a = a.replace('slide', '').replace('.xml', '');
    b = b.replace('slide', '').replace('.xml', '');
    if (+a > +b) return 1;
    else if (+a < +b) return -1;
    else return 0;
  });
  const resultArray: Slide[] = [];
  const generateFileBuffers = async () => {
    return await Promise.all(
      sorted.map((file) =>
        fsPromise.readFile(`./extract-to/ppt/slides/${file}`)
      )
    );
  };
  generateFileBuffers()
    .then((res) => {
      res.forEach((buffer) => {
        const slide = new Slide(buffer);
        resultArray.push(slide);
      });
    })
    .then((res) => console.log(resultArray[3].textNodes));
});
 */
