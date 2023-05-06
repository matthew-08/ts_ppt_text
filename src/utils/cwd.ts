import path from 'path';
const cwd = () => {
  return path.join(process.cwd(), 'node_modules', 'ts_ppt_text', 'dist');
};

export default cwd;
