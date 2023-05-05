import path from 'path';
import Presentation from './src/presentation';

const pres = new Presentation(path.join(__dirname, 'test.pptx'), __dirname);

pres.applySlideChanges();
pres.generateNewPPT(path.join(__dirname, 'hello'));
