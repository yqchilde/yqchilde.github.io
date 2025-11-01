import fs from 'fs'
import matter from 'gray-matter'

export default {
  watch: ['posts/**/README.md'],
  load(articleFiles) {
    return articleFiles.map(articleFile => {
      const articleContent = fs.readFileSync(articleFile, 'utf-8');
      const { data } = matter(articleContent);

      const removeNumberPrefix = (folderName) => folderName.replace(/^\d+-/, '');
      const relative = articleFile.substring(articleFile.lastIndexOf('/posts/') + 7);
      const noReadme = relative.replace('/README.md', '');
      const parts = noReadme.split('/').filter(Boolean);
      if (parts.length >= 1) {
        const lastIdx = parts.length - 1;
        parts[lastIdx] = removeNumberPrefix(parts[lastIdx]);
      }
      const cleanPath = '/' + parts.join('/');

      return {
        ...data,
        path: cleanPath,
      }
    })
  }
}