import type { MarkdownOptions } from 'vitepress';
import { vitepressPluginLegend } from 'vitepress-plugin-legend';

export const markdown: MarkdownOptions = {
    lineNumbers: true,
    image: {
        lazyLoading: true,
    },
    config: (md) => {
        // 添加Mermaid和Markmap支持
        vitepressPluginLegend(md);
        
        md.renderer.rules.heading_close = (tokens, idx, options, env, slf) => {
            let htmlResult = slf.renderToken(tokens, idx, options);
            if (tokens[idx].tag === 'h1') htmlResult += `\n<ClientOnly><ArticleMetadata v-if="($frontmatter?.aside ?? true) && ($frontmatter?.showArticleMetadata ?? true)" :article="$frontmatter" /></ClientOnly>`;
            return htmlResult;
        }
    }
}