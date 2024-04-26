import{_ as t}from"./chunks/articleMetadata.BUvlmdsD.js";import{_ as o,m as c,a as r,u as d,B as h,e as n,x as k,aj as F,o as i,p as m,q as b}from"./chunks/framework.BKaFImy5.js";import"./chunks/theme.DHWrSUup.js";const U=JSON.parse('{"title":"docker-compose使用env处理环境变量妙用","description":"记录在docker-compose中对环境变量抽离，使用env文件嵌套变量使用的方法。","frontmatter":{"title":"docker-compose使用env处理环境变量妙用","description":"记录在docker-compose中对环境变量抽离，使用env文件嵌套变量使用的方法。","date":"2021-03-13T12:49:58.000Z","tags":["Docker"]},"headers":[],"relativePath":"blog/2021/docker-compose-env-file.md","filePath":"posts/blog/2021/docker-compose-env-file/README.md","lastUpdated":1714096674000}'),u={name:"blog/2021/docker-compose-env-file.md"},g=n("h1",{id:"docker-compose使用env处理环境变量妙用",tabindex:"-1"},[k("docker-compose使用env处理环境变量妙用 "),n("a",{class:"header-anchor",href:"#docker-compose使用env处理环境变量妙用","aria-label":'Permalink to "docker-compose使用env处理环境变量妙用"'},"​")],-1),v=F('<div class="tip custom-block"><p class="custom-block-title">背景</p><p>最近在用的一个服务他的docker-compose需要配置很多很多的环境变量，而每个环境变量可能又很长，所以查阅资料了解到env file这种配置</p></div><h2 id="env-file" tabindex="-1">env_file <a class="header-anchor" href="#env-file" aria-label="Permalink to &quot;env_file&quot;">​</a></h2><p>官方文档地址 <a href="https://docs.docker.com/compose/environment-variables" target="_blank" rel="noreferrer">https://docs.docker.com/compose/environment-variables</a>，这里记录一下我遇到的问题，如果要使用env_file配置，这时候，是会把所有的变量都带入进来的，我不需要那么多变量，举个🌰</p><div class="language-txt vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">txt</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span># 京东农场</span></span>\n<span class="line"><span>FRUIT1=0f6f68f0d58d43a98d2f578a7e1a0215</span></span>\n<span class="line"><span>FRUIT2=8e2785b15cef4f03a714f4288a496dec</span></span>\n<span class="line"><span>FRUIT3=c8f3876f3ea24dedbb174868ad53e4d2</span></span>\n<span class="line"><span>FRUIT4=667ebac5844e418d98393004362eb28s</span></span>\n<span class="line"><span>FRUIT5=dad356ebad9a4de6ab8fdd774b2ea94g</span></span>\n<span class="line"><span></span></span>\n<span class="line"><span></span></span>\n<span class="line"><span>FRUIT_SHARECODE1=${FRUIT2}@${FRUIT3}@${FRUIT4}@${FRUIT5}</span></span>\n<span class="line"><span>FRUIT_SHARECODE2=${FRUIT1}@${FRUIT3}@${FRUIT4}@${FRUIT5}</span></span>\n<span class="line"><span>FRUIT_SHARECODE3=${FRUIT1}@${FRUIT2}@${FRUIT4}@${FRUIT5}</span></span>\n<span class="line"><span>FRUIT_SHARECODE4=${FRUIT1}@${FRUIT2}@${FRUIT3}@${FRUIT5}</span></span>\n<span class="line"><span>FRUIT_SHARECODE5=${FRUIT1}@${FRUIT2}@${FRUIT3}@${FRUIT4}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br></div></div><p><code>.env</code>文件中有这么一段内容，其中 <code>FRUIT1-5</code> 和 <code>FRUIT_SHARECODE1-5</code>全是变量，但是很显然我只要想 <code>FRUIT_SHARECODE1-5</code>的变量，不想要上面的，可以说是我需要按需引入变量，如果直接用如下这种配置，就会将所有的变量全部引入</p><div class="language-bash vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">$</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> cat</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> docker-compose.yml</span></span>\n<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">version:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;3&#39;</span></span>\n<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">services:</span></span>\n<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  api:</span></span>\n<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    image:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;node:6-alpine&#39;</span></span>\n<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    env_file:</span></span>\n<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">     -</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ./api.env</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><p>所以最终想法还是只在同目录用 <code>.env</code> 文件，这样不需要特别声明引入，只需要保证同目录即可，这时候我在 <code>docker-compose.yml</code> 文件中引入了 <code>FRUIT_SHARECODE1</code> 变量，按照我的理解是变量嵌套会间接引入上面的变量，结果变成了下面这个样子。</p><p><img src="https://pic.yqqy.top/blog/20210313150914.png" alt="" title="图1" loading="lazy"></p><p>难道docker-compose不支持这种写法？还被多加了一个 <code>$</code>变成了 <code>$${}</code> ，随后在自己的本地电脑试了下，是按照我预想的结果输出的，那么问题就好说了，这说明是dockerc-compose版本不对，并不是不支持，当前服务器下的版本是 1.25.4，翻阅版本记录发现在 1.26.0 以后使用了 <code>python-dotenv</code> 管理了env_file，所以至少要使用大于1.26.0以后的版本。</p><p><img src="https://pic.yqqy.top/blog/20210313151336.png" alt="" title="图2" loading="lazy"></p><p>顺便提一下更新 <code>docker-compose</code>版本步骤</p><div class="language-bash vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">$</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> whereis</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> docker-compose</span></span>\n<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">docker-compose:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /usr/local/bin/docker-compose</span></span>\n<span class="line"></span>\n<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 记得后面保存的位置是原来的位置</span></span>\n<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">$</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> curl</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -L</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> https://github.com/docker/compose/releases/download/1.27.4/docker-compose-`</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">uname</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -s</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">`</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">-</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">`</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">uname</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -m</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">`</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> -o</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /usr/local/bin/docker-compose</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p>更新之后再看一下效果吧</p><p><img src="https://pic.yqqy.top/blog/20210313151938.png" alt="" title="图三" loading="lazy"></p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>docker-compose很方便，使用 <code>.env</code> 文件会更加方便，这样我们可以传递更多的内容进来，每次只需要维护 <code>.env</code> 不用频繁修改 <code>docker-compose.yml</code> 。</p>',16);function C(s,y,_,R,T,f){const p=t,l=c("ClientOnly");return i(),r("div",null,[g,d(l,null,{default:h(()=>{var a,e;return[(((a=s.$frontmatter)==null?void 0:a.aside)??!0)&&(((e=s.$frontmatter)==null?void 0:e.showArticleMetadata)??!0)?(i(),m(p,{key:0,article:s.$frontmatter},null,8,["article"])):b("",!0)]}),_:1}),v])}const $=o(u,[["render",C]]);export{U as __pageData,$ as default};