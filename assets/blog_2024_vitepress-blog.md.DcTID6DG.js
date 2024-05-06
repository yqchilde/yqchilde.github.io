import{_ as n}from"./chunks/articleMetadata.Cf_qG6bW.js";import{_ as o,h as i,u as c,B as h,l as a,x as g,ai as p,m,f as l,p as f,q as b}from"./chunks/framework.h2at8Qew.js";import"./chunks/theme.DtUmdvIn.js";const u="/assets/1714987487.Y9wVn_T2.png",w=JSON.parse('{"title":"VitePress博客-主题介绍","description":"vitepress1.0版本发布了，挺好看的，用来搭建一个博客看看","frontmatter":{"title":"VitePress博客-主题介绍","description":"vitepress1.0版本发布了，挺好看的，用来搭建一个博客看看","date":"2024-04-29T20:34:56.000Z","tags":["VitePress"]},"headers":[],"relativePath":"blog/2024/vitepress-blog.md","filePath":"posts/blog/2024/vitepress-blog/README.md","lastUpdated":1715006835000}'),y={name:"blog/2024/vitepress-blog.md"},_=a("h1",{id:"vitepress博客-主题介绍",tabindex:"-1"},[g("VitePress博客-主题介绍 "),a("a",{class:"header-anchor",href:"#vitepress博客-主题介绍","aria-label":'Permalink to "VitePress博客-主题介绍"'},"​")],-1),x=p('<div class="tip custom-block"><p class="custom-block-title">😉</p><p>VitePress 1.0版本发布了，挺好看的，用来搭建一个博客看看，之前是Hugo，比较爱折腾。</p><blockquote><p><strong>设计：</strong> 博客的设计从以下三位站长网站抄的，在此表达感谢！</p><ul><li><a href="https://blog.charles7c.top" target="_blank" rel="noreferrer">https://blog.charles7c.top</a></li><li><a href="https://notes.fe-mm.com" target="_blank" rel="noreferrer">https://notes.fe-mm.com</a></li><li><a href="https://justin3go.com" target="_blank" rel="noreferrer">https://justin3go.com</a></li></ul></blockquote></div><h2 id="frontmatter" tabindex="-1">frontmatter <a class="header-anchor" href="#frontmatter" aria-label="Permalink to &quot;frontmatter&quot;">​</a></h2><p>VitePress 支持在所有 Markdown 文件中使用 YAML frontmatter，并使用 <a href="https://github.com/jonschlinkert/gray-matter" target="_blank" rel="noreferrer">gray-matter</a> 解析。frontmatter 必须位于 Markdown 文件的顶部 (在任何元素之前，包括 <code>&lt;script&gt;</code> 标签)，并且需要在三条虚线之间采用有效的 YAML 格式。</p><ol><li><code>VitePress</code>内置的<code>frontmatter</code>，看这里：<a href="https://vitepress.dev/zh/reference/frontmatter-config" target="_blank" rel="noreferrer">frontmatter-config</a></li><li><code>本博客</code>新增的<code>frontmatter</code>，有如下配置：</li></ol><table><thead><tr><th style="text-align:center;">字段</th><th style="text-align:center;">格式</th><th style="text-align:center;">应用范围</th><th>含义</th></tr></thead><tbody><tr><td style="text-align:center;">sort</td><td style="text-align:center;">1</td><td style="text-align:center;">sidebar / doc</td><td>sidebar排序，来进行主目录或文章的排序，同一个目录下，sort越小越靠前</td></tr><tr><td style="text-align:center;">needRoute</td><td style="text-align:center;">true / false</td><td style="text-align:center;">sidebar</td><td>sidebar是否需要路由，true的话可以点过去来介绍这个目录是干什么的</td></tr><tr><td style="text-align:center;">date</td><td style="text-align:center;">YYYY-MM-DD hh:mm:ss</td><td style="text-align:center;">doc</td><td>文章发布日期</td></tr><tr><td style="text-align:center;">tags</td><td style="text-align:center;">[&quot;Golang&quot;, &quot;Python&quot;]</td><td style="text-align:center;">doc</td><td>文章标签</td></tr><tr><td style="text-align:center;">showArticleMetadata</td><td style="text-align:center;">true / false</td><td style="text-align:center;">doc</td><td>是否展示文章主标题下面的信息，就是原创那行</td></tr><tr><td style="text-align:center;">showComment</td><td style="text-align:center;">true / false</td><td style="text-align:center;">doc</td><td>是否展示评论</td></tr><tr><td style="text-align:center;">showChapterCount</td><td style="text-align:center;">true / false</td><td style="text-align:center;">doc</td><td>是否展示sidebar上的主目录的文章篇幅数</td></tr><tr><td style="text-align:center;">isOriginal</td><td style="text-align:center;">true / false</td><td style="text-align:center;">doc</td><td>文章是否原创</td></tr><tr><td style="text-align:center;">author</td><td style="text-align:center;"></td><td style="text-align:center;">doc</td><td>文章作者，仅非原创需要写</td></tr><tr><td style="text-align:center;">articleLink</td><td style="text-align:center;"></td><td style="text-align:center;">doc</td><td>文章链接，仅非原创需要写，原文链接</td></tr></tbody></table><h2 id="sidebar" tabindex="-1">sidebar <a class="header-anchor" href="#sidebar" aria-label="Permalink to &quot;sidebar&quot;">​</a></h2><p>采用自动根据目录自动生成，规则看这里：</p><ul><li><a href="https://github.com/yqchilde/yqchilde.github.io/blob/ad645dd5604eb41c6d8de3ef29c0f43de1a10ad5/.vitepress/config/sidebar.ts#L16" target="_blank" rel="noreferrer">sidebar.ts#L16</a></li><li><a href="https://github.com/yqchilde/yqchilde.github.io/blob/ad645dd5604eb41c6d8de3ef29c0f43de1a10ad5/.vitepress/config/sidebar.ts#L91" target="_blank" rel="noreferrer">sidebar.ts#L91</a></li></ul><h2 id="heatmap" tabindex="-1">heatmap <a class="header-anchor" href="#heatmap" aria-label="Permalink to &quot;heatmap&quot;">​</a></h2><p><img src="'+u+'" alt="img" loading="lazy"></p><p><a href="./../2024/vitepress-blog-2">点这里看详情</a></p>',11);function k(t,q,v,P,V,M){const s=n,d=m("ClientOnly");return l(),i("div",null,[_,c(d,null,{default:h(()=>{var e,r;return[(((e=t.$frontmatter)==null?void 0:e.aside)??!0)&&(((r=t.$frontmatter)==null?void 0:r.showArticleMetadata)??!0)?(l(),f(s,{key:0,article:t.$frontmatter},null,8,["article"])):b("",!0)]}),_:1}),x])}const L=o(y,[["render",k]]);export{w as __pageData,L as default};
