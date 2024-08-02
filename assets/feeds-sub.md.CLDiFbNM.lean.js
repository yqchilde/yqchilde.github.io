import{d as _}from"./chunks/theme.DpQcp01s.js";import{d as Y,o as E,a as z,c as k,f as i,h as l,l as n,F as y,N as b,n as N,M as d,q as j,Y as $,Z as G,$ as J,_ as M,u as S,B as F,m as O}from"./chunks/framework.KEtiH2AC.js";const A=[{name:"阮一峰的网络日志",avatar:"http://www.ruanyifeng.com/blog/images/person2_s.jpg",info:[{name:"阮一峰的网络日志",title:"科技爱好者周刊（第 309 期）：无人驾驶出租车的双面刃",url:"http://www.ruanyifeng.com/blog/2024/07/weekly-issue-309.html",time:"Fri, 19 Jul 2024 08:09:23 +0800"}]},{name:"Alex Chi Z.",avatar:"https://www.skyzh.dev/skyzh.jpg",info:[{name:"Alex Chi Z.",title:"在 Rust 中实现基于 io_uring 的异步随机读文件",url:"https://www.skyzh.dev/blog/2021-01-30-async-random-read-with-rust/",time:"Sat, 30 Jan 2021 09:37:23 GMT"},{name:"Alex Chi Z.",title:"io_uring 的接口与实现",url:"https://www.skyzh.dev/blog/2021-06-14-deep-dive-io-uring/",time:"Mon, 14 Jun 2021 14:00:00 GMT"}]},{name:"潮流周刊",avatar:"https://avatars.githubusercontent.com/u/8736212?v=4",info:[{name:"潮流周刊",title:"第185期 - 光照之美",url:"https://weekly.tw93.fun/posts/185-%E5%85%89%E7%85%A7%E4%B9%8B%E7%BE%8E/",time:"Mon, 15 Jul 2024 00:00:00 GMT"}]},{name:"七猫技术团队",avatar:"",info:[{name:"七猫技术团队",title:"Java+MotionEvent实现埋点自动化",url:"https://tech.qimao.com/java-motioneventshi-xian-mai-dian-zi-dong-hua-2/",time:"Tue, 02 Jul 2024 05:37:31 GMT"}]}],C={items:A},B=u=>(G("data-v-5eed86f9"),u=u(),J(),u),T={class:"m-center"},D={class:"m-con"},Z=B(()=>n("div",{class:"mt-8 pb-3 text-4xl",style:{"border-bottom":"1px solid var(--vp-c-divider)"}},"RSS 订阅",-1)),R=["onClick"],V={class:"overflow-clip line-clamp-1"},q=B(()=>n("div",{class:"pb-3 text-4xl",style:{"border-bottom":"1px solid var(--vp-c-divider)"}},null,-1)),L={class:"pb-2"},U={class:"text-2xl"},H=["aria-label"],K={class:"basis-4/6 text-hidden line-clamp-1"},Q=["href"],W={class:"basis-2/6 text-hidden line-clamp-1"},X={class:"flex justify-center mt-4 mb-2"},ee={style:{border:"1px dashed var(--vp-c-divider)"}},te=["disabled"],se={class:"mx-2",style:{"align-content":"center"}},ae=["disabled"],ne=Y({__name:"feedsSub",setup(u){E(()=>{x(),v()});const e=z({currentName:"",itemsGroup:{},names:[],currItems:[],itemsByYear:{},years:[],currentPage:1,pageSize:18});function x(){C.forEach(s=>{e.itemsGroup[s.name]=s.items,e.names.push(s.name)})}function v(s){!s||s===e.currentName?(e.currItems=C.flatMap(a=>a.items),e.currentName=""):(e.currentName=s,e.currItems=e.itemsGroup[s]),e.currItems.sort((a,t)=>_(t.date).valueOf()-_(a.date).valueOf()),e.currItems&&(e.itemsByYear={},e.years=[],e.currItems.forEach(a=>{const t=_(a.date).format("YYYY");e.years.includes(t)||e.years.push(t),e.itemsByYear[t]||(e.itemsByYear[t]=[]),e.itemsByYear[t].push(a)})),e.currentPage=1}const m=k(()=>Math.ceil(e.currItems.length/e.pageSize)),w=k(()=>{const s=(e.currentPage-1)*e.pageSize;let a=0,t={},c=0;for(const o of e.years){if(!e.itemsByYear[o])continue;const h=e.itemsByYear[o],f=h.length;if(a+f<=s){a+=f;continue}const g=Math.max(s-a,0),P=e.pageSize-c,I=Math.min(g+P,f);if(t[o]||(t[o]=[]),t[o].push(...h.slice(g,I)),c+=I-g,a+=f,c>=e.pageSize)break}const r={};return Object.keys(t).sort((o,h)=>parseInt(h)-parseInt(o)).forEach(o=>{r[o+"年"]=t[o]}),r});function p(s){s>0&&s<=m.value&&(e.currentPage=s)}return(s,a)=>(i(),l("div",T,[n("div",D,[Z,e.names?(i(!0),l(y,{key:0},b(e.names,(t,c)=>(i(),l("div",{class:N(["cursor-default inline-block mt-3 px-2 py-1 max-w-200px",{"bg-just-light/20":t===e.currentName}]),key:t,onClick:r=>v(t)},[n("span",V,d(t),1)],10,R))),128)):j("",!0),q,(i(!0),l(y,null,b(w.value,(t,c)=>(i(),l("div",{class:"pt-5 text-lg",key:c},[n("header",L,[n("h1",U,d(c),1)]),(i(!0),l(y,null,b(t,r=>(i(),l("div",{class:"pl-2 md:pl-4 flex",key:r.link},[n("div",{class:"basis-1/6 text-hidden line-clamp-1","aria-label":r.date},d($(_)(r.date).format("MM月DD日")),9,H),n("div",K,[n("a",{class:"cursor-default hover:bg-just-light/20 hover:text-just-dark",href:r.link,target:"_self"},d(r.title),9,Q)]),n("div",W,d(r.name),1)]))),128))]))),128)),n("div",X,[n("div",ee,[n("button",{class:"mx-1 px-2 py-1 border rounded hover:bg-gray-200",onClick:a[0]||(a[0]=t=>p(e.currentPage-1)),disabled:e.currentPage===1}," 上一页 ",8,te),n("span",se,"第 "+d(e.currentPage)+" 页 / 共 "+d(m.value)+" 页",1),n("button",{class:"mx-1 px-2 py-1 border rounded hover:bg-gray-200",onClick:a[1]||(a[1]=t=>p(e.currentPage+1)),disabled:e.currentPage===m.value}," 下一页 ",8,ae)])])])]))}}),re=M(ne,[["__scopeId","data-v-5eed86f9"]]),de=JSON.parse('{"title":"Feeds-Sub","description":"","frontmatter":{"title":"Feeds-Sub","outline":false,"showArticleMetadata":false,"editLink":false,"showComment":false,"aside":false,"layout":"page"},"headers":[],"relativePath":"feeds-sub.md","filePath":"pages/feeds-sub/index.md","lastUpdated":1722594381000}'),oe={name:"feeds-sub.md"};function ie(u,e,x,v,m,w){const p=re,s=O("ClientOnly");return i(),l("div",null,[S(s,null,{default:F(()=>[S(p)]),_:1})])}const ue=M(oe,[["render",ie]]);export{de as __pageData,ue as default};
