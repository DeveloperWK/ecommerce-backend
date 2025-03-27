import { createHash } from 'node:crypto';
const generateETag = (data: string) => {
  const hash = createHash('sha256');
  hash.update(data);
  return hash.digest('hex');
};
export default generateETag;
