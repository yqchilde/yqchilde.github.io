import{i as j}from"./chunk-353BL4L5-BaBLD7R4-CCFpVaw8.DRxm5BqC.js";import{S as p,a7 as H,a6 as J,a8 as U,a9 as X,ap as Y,ao as Z,u as z,m as q,aB as K,aT as Q,aV as _,ab as tt,au as et,aD as at,aW as S,aX as nt,aY as O}from"./theme.CnTPM46A.js";import{I as rt}from"./treemap-75Q7IDZK-Du2UP5aq-Bh4ITUZl.Dn9MqH51.js";import{d as V}from"./arc-BQW5_i1I-BPBG9OVM.DrJ_PTD5.js";import{g as it}from"./ordinal-DfAQgscy-BEJTu10r.vTmdWN-q.js";import"./framework.B5MS1KJz.js";import"./baseUniq-D-4w9BQh-CXDlGfTI.DRVDvkfi.js";import"./basePickBy-DRTm9oBc-BeRiPSDA.BVKagM7q.js";import"./clone-pm6OfDjU-WrCLsCa7.Da-uZaGW.js";import"./init-DjUOC4st-C8Nwz6AJ.BTi8F14B.js";function ot(t,a){return a<t?-1:a>t?1:a>=t?0:NaN}function lt(t){return t}function st(){var t=lt,a=ot,l=null,m=S(0),g=S(O),w=S(0);function i(e){var n,s=(e=nt(e)).length,u,$,h=0,c=new Array(s),r=new Array(s),x=+m.apply(this,arguments),A=Math.min(O,Math.max(-O,g.apply(this,arguments)-x)),f,v=Math.min(Math.abs(A)/s,w.apply(this,arguments)),C=v*(A<0?-1:1),d;for(n=0;n<s;++n)(d=r[c[n]=n]=+t(e[n],n,e))>0&&(h+=d);for(a!=null?c.sort(function(y,D){return a(r[y],r[D])}):l!=null&&c.sort(function(y,D){return l(e[y],e[D])}),n=0,$=h?(A-s*C)/h:0;n<s;++n,x=f)u=c[n],d=r[u],f=x+(d>0?d*$:0)+C,r[u]={data:e[u],index:n,value:d,startAngle:x,endAngle:f,padAngle:v};return r}return i.value=function(e){return arguments.length?(t=typeof e=="function"?e:S(+e),i):t},i.sortValues=function(e){return arguments.length?(a=e,l=null,i):a},i.sort=function(e){return arguments.length?(l=e,a=null,i):l},i.startAngle=function(e){return arguments.length?(m=typeof e=="function"?e:S(+e),i):m},i.endAngle=function(e){return arguments.length?(g=typeof e=="function"?e:S(+e),i):g},i.padAngle=function(e){return arguments.length?(w=typeof e=="function"?e:S(+e),i):w},i}var ct=at.pie,R={sections:new Map,showData:!1},M=R.sections,W=R.showData,pt=structuredClone(ct),ut=p(()=>structuredClone(pt),"getConfig"),dt=p(()=>{M=new Map,W=R.showData,et()},"clear"),gt=p(({label:t,value:a})=>{M.has(t)||(M.set(t,a),z.debug(`added new section: ${t}, with value: ${a}`))},"addSection"),ft=p(()=>M,"getSections"),mt=p(t=>{W=t},"setShowData"),ht=p(()=>W,"getShowData"),L={getConfig:ut,clear:dt,setDiagramTitle:Z,getDiagramTitle:Y,setAccTitle:X,getAccTitle:U,setAccDescription:J,getAccDescription:H,addSection:gt,getSections:ft,setShowData:mt,getShowData:ht},xt=p((t,a)=>{j(t,a),a.setShowData(t.showData),t.sections.map(a.addSection)},"populateDb"),yt={parse:p(async t=>{const a=await rt("pie",t);z.debug(a),xt(a,L)},"parse")},St=p(t=>`
  .pieCircle{
    stroke: ${t.pieStrokeColor};
    stroke-width : ${t.pieStrokeWidth};
    opacity : ${t.pieOpacity};
  }
  .pieOuterCircle{
    stroke: ${t.pieOuterStrokeColor};
    stroke-width: ${t.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${t.pieTitleTextSize};
    fill: ${t.pieTitleTextColor};
    font-family: ${t.fontFamily};
  }
  .slice {
    font-family: ${t.fontFamily};
    fill: ${t.pieSectionTextColor};
    font-size:${t.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${t.pieLegendTextColor};
    font-family: ${t.fontFamily};
    font-size: ${t.pieLegendTextSize};
  }
`,"getStyles"),wt=St,$t=p(t=>{const a=[...t.entries()].map(l=>({label:l[0],value:l[1]})).sort((l,m)=>m.value-l.value);return st().value(l=>l.value)(a)},"createPieArcs"),At=p((t,a,l,m)=>{z.debug(`rendering pie chart
`+t);const g=m.db,w=q(),i=K(g.getConfig(),w.pie),e=40,n=18,s=4,u=450,$=u,h=Q(a),c=h.append("g");c.attr("transform","translate("+$/2+","+u/2+")");const{themeVariables:r}=w;let[x]=_(r.pieOuterStrokeWidth);x??(x=2);const A=i.textPosition,f=Math.min($,u)/2-e,v=V().innerRadius(0).outerRadius(f),C=V().innerRadius(f*A).outerRadius(f*A);c.append("circle").attr("cx",0).attr("cy",0).attr("r",f+x/2).attr("class","pieOuterCircle");const d=g.getSections(),y=$t(d),D=[r.pie1,r.pie2,r.pie3,r.pie4,r.pie5,r.pie6,r.pie7,r.pie8,r.pie9,r.pie10,r.pie11,r.pie12],T=it(D);c.selectAll("mySlices").data(y).enter().append("path").attr("d",v).attr("fill",o=>T(o.data.label)).attr("class","pieCircle");let B=0;d.forEach(o=>{B+=o}),c.selectAll("mySlices").data(y).enter().append("text").text(o=>(o.data.value/B*100).toFixed(0)+"%").attr("transform",o=>"translate("+C.centroid(o)+")").style("text-anchor","middle").attr("class","slice"),c.append("text").text(g.getDiagramTitle()).attr("x",0).attr("y",-400/2).attr("class","pieTitleText");const P=c.selectAll(".legend").data(T.domain()).enter().append("g").attr("class","legend").attr("transform",(o,b)=>{const k=n+s,E=k*T.domain().length/2,G=12*n,I=b*k-E;return"translate("+G+","+I+")"});P.append("rect").attr("width",n).attr("height",n).style("fill",T).style("stroke",T),P.data(y).append("text").attr("x",n+s).attr("y",n-s).text(o=>{const{label:b,value:k}=o.data;return g.getShowData()?`${b} [${k}]`:b});const N=Math.max(...P.selectAll("text").nodes().map(o=>(o==null?void 0:o.getBoundingClientRect().width)??0)),F=$+e+n+s+N;h.attr("viewBox",`0 0 ${F} ${u}`),tt(h,u,F,i.useMaxWidth)},"draw"),Dt={draw:At},Wt={parser:yt,db:L,renderer:Dt,styles:wt};export{Wt as diagram};
