import fs from 'fs'
import matter from 'gray-matter'

export default {
  watch: ['posts/**/README.md'],
  load(articleFiles) {
    return articleFiles.map(articleFile => {
      const articleContent = fs.readFileSync(articleFile, 'utf-8');
      const { data } = matter(articleContent);

      return {
        ...data,
        path: articleFile.substring(articleFile.lastIndexOf('/posts/') + 6).replace('/README.md', ''),
      }
    })
  }
}