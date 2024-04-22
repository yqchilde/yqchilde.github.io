import{_ as d}from"./chunks/articleMetadata.BTt4QM4q.js";import{_ as g,B as n,a as o,u as l,E as p,e as t,H as e,ah as k,o as h,D as y,C as b}from"./chunks/framework.Bb9ScoKk.js";import"./chunks/theme.DroR80N-.js";const x=JSON.parse('{"title":"Golang验证码–base64Captcha库1.3.0版本构建实例","description":"这个库烦了我两天，我能接触到的例子都是旧版的，新版简直就是大改版哦，构建函数简直和旧版出入太大，函数参数及返回值皆不一样，记录一下最新版的字符验证码的完整实例，（数字验证码、计算验证码、汉字验证码以及语音验证码构建方法举一反三）","frontmatter":{"title":"Golang验证码–base64Captcha库1.3.0版本构建实例","description":"这个库烦了我两天，我能接触到的例子都是旧版的，新版简直就是大改版哦，构建函数简直和旧版出入太大，函数参数及返回值皆不一样，记录一下最新版的字符验证码的完整实例，（数字验证码、计算验证码、汉字验证码以及语音验证码构建方法举一反三）","date":"2020-02-07T08:21:06.000Z","categories":["后端"],"tags":["Golang"]},"headers":[],"relativePath":"blog/2020/golang-base64captcha.md","filePath":"posts/blog/2020/golang-base64captcha/README.md","lastUpdated":1713782366000}'),F={name:"blog/2020/golang-base64captcha.md"},u=t("h1",{id:"golang验证码–base64captcha库1-3-0版本构建实例",tabindex:"-1"},[e("Golang验证码–base64Captcha库1.3.0版本构建实例 "),t("a",{class:"header-anchor",href:"#golang验证码–base64captcha库1-3-0版本构建实例","aria-label":'Permalink to "Golang验证码–base64Captcha库1.3.0版本构建实例"'},"​")],-1),m=k('<div class="tip custom-block"><p class="custom-block-title">背景</p><p>这个库烦了我两天，我能接触到的例子都是旧版的，新版简直就是大改版哦，构建函数简直和旧版出入太大，函数参数及返回值皆不一样，记录一下最新版的字符验证码的完整实例，（数字验证码、计算验证码、汉字验证码以及语音验证码构建方法举一反三）</p></div><h3 id="官方例子地址" tabindex="-1">官方例子地址 <a class="header-anchor" href="#官方例子地址" aria-label="Permalink to &quot;官方例子地址&quot;">​</a></h3><p><a href="https://captcha.mojotv.cn/" target="_blank" rel="noreferrer">在线构建验证码样式</a></p>',3),C=k(`<p>旧版的<code>base64Captcha.ConfigCharacte</code> 以及 <code>base64Captcha.GenerateCaptcha</code>方法由于作者重构已经取消，具体实现看下面代码</p><h3 id="代码如下" tabindex="-1">代码如下 <a class="header-anchor" href="#代码如下" aria-label="Permalink to &quot;代码如下&quot;">​</a></h3><div class="language-go vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">go</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">package</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> tool</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">	&quot;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">github.com/gin-gonic/gin</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">	&quot;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">github.com/mojocn/base64Captcha</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">	&quot;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">image/color</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">type</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> CaptchaResult</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> struct</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">	Id          </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">string</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> \`json:&quot;id&quot;\`</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">	Base64Blob  </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">string</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> \`json:&quot;base_64_blob&quot;\`</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">	VerifyValue </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">string</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> \`json:&quot;code&quot;\`</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 设置自带的store</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">var</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> store </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> base64Captcha.DefaultMemStore</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 生成图形化验证码</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">func</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> GenerateCaptcha</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">ctx</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> *</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">gin</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Context</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">	var</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> driver </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">base64Captcha</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Driver</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">	var</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> driverString </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">base64Captcha</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">DriverString</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">	// 配置验证码信息</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">	captchaConfig </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:=</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> base64Captcha</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">DriverString</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">		Height:          </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">30</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">		Width:           </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">60</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">		NoiseCount:      </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">		ShowLineOptions: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">2</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> |</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 4</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">		Length:          </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">4</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">		Source:          </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;1234567890qwertyuioplkjhgfdsazxcvbnm&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">		BgColor: </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&amp;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">RGBA</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">			R: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">3</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">			G: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">102</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">			B: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">214</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">			A: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">125</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">		},</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">		Fonts: []</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">string</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;wqy-microhei.ttc&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">},</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">	}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">	// 自定义配置，如果不需要自定义配置，则上面的结构体和下面这行代码不用写</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">	driverString </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> captchaConfig</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">	driver </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> driverString.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">ConvertFonts</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">	captcha </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> base64Captcha.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">NewCaptcha</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(driver, store)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">	id, b64s, err </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> captcha.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Generate</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">	if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> err </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">!=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> nil</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">		Failed</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(ctx, err.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Error</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">())</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">	}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">	captchaResult </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:=</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> CaptchaResult</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">		Id:         id,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">		Base64Blob: b64s,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">	}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">	Success</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(ctx, </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">gin</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">H</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">		&quot;captcha_result&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: captchaResult,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">	})</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br></div></div><p>这样子输出的就是一条json，放在项目里面就是这样的</p><p><img src="https://pic.yqqy.top/blog/20200207/uIYagTxvi3FE.png" alt="mark" title="效果图"></p>`,5);function B(s,_,A,D,f,v){const r=d,E=n("ClientOnly"),c=n("font");return h(),o("div",null,[u,l(E,null,{default:p(()=>{var a,i;return[(((a=s.$frontmatter)==null?void 0:a.aside)??!0)&&(((i=s.$frontmatter)==null?void 0:i.showArticleMetadata)??!0)?(h(),y(r,{key:0,article:s.$frontmatter},null,8,["article"])):b("",!0)]}),_:1}),m,l(c,{color:"#F56C6C"},{default:p(()=>[e("注意: ")]),_:1}),C])}const V=g(F,[["render",B]]);export{x as __pageData,V as default};