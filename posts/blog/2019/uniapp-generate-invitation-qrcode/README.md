---
title: "Uni-App生成邀请二维码"
description: "介绍了如何用Uni-App生成邀请二维码并画出来"
date: 2019-07-22 14:36:55
tags: ["UniAPP"]
---

# Uni-App生成邀请二维码

## 先看效果图

![mark](https://pic.yqqy.top/blog/2017unishengchengqr.gif "效果图")

## 引入插件

插件源地址： [https://dwz.cn/YbQ9718O](https://dwz.cn/YbQ9718O)

```javascript
import _app from '@/commons/QS-SharePoster/app.js';
import getSharePoster from '@/commons/QS-SharePoster/QS-SharePoster.js';
```

## 配置背景图片

在 `插件中app.js` 里面写 `getPosterUrl` 方法

```javascript
getPosterUrl(objs) { // 后端获取背景图的url路径方法
		let {
			backgroundImage,
			type
		} = objs;
		return new Promise((rs, rj) => {//resolve 和 reject
			let image;
			if (backgroundImage)
				image = backgroundImage;
			else
				switch (type) { //根据type获取背景图, 一般要改成request获取
					case 1:
						image = '';
						break;
					default:
						image = 'https://ae01.alicdn.com/kf/HTB1iTw3a8r0gK0jSZFn762RRXXaM.png';
						break;
				}
			if(image)
				rs(image); // resolve图片的路径
			else
				rj('背景图片路径不存在');
		})
	},
```

**此处会在前台调用，然后返回image给QS整合，地址可以写给后端返回Api接口用request请求获取，我开始也是这样，后来改了，因为在目前功能够用了**

## 前台页面

- 先调起js方法，template代码如下：

```html
<view class="classBtn">
	<text class="cuIcon-forwardfill"></text>
	<text @tap="shareFc(index)">邀请</text>
</view>
```

@tap点击事件，我给了一个参数，是为了方便我记录点击的是列表中的哪一个

- 要展示的图片放在view里面

```html
<!-- 邀请二维码 -->
<view class="flex_row_c_c modalView" :class="qrShow?'show':''" @tap="hideQr()">
	<view class="flex_column">
		<view class="backgroundColor-white padding1vh border_radius_10px">
			<image :src="poster.finalPath" mode="widthFix" class="posterImage"></image>
		</view>
		<view class="flex_row marginTop2vh">
			<button type="primary" size="mini" @tap.prevent.stop="saveImage()">保存图片</button>
			<button type="primary" size="mini" @tap.prevent.stop="share()">分享图片</button>
		</view>
	</view>
</view>
<view class="hideCanvasView">
	<canvas class="hideCanvas" canvas-id="ShareCanvasId" :style="{width: (poster.width||0) + 'px', height: (poster.height||0) + 'px'}"></canvas>
</view>
```

- 生成图片展示modal的css样式

```css
/* 邀请二维码 */
.hideCanvasView {
	position: relative;
}

.hideCanvas {
	position: fixed;
	top: -99999upx;
	left: -99999upx;
	z-index: -99999;
}

.flex_row_c_c {
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
}

.modalView {
	width: 100%;
	height: 100%;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	opacity: 0;
	outline: 0;
	transform: scale(3);
	perspective: 2500upx;
	background: rgba(0, 0, 0, 0.6);
	transition: all .3s ease-in-out;
	pointer-events: none;
	backface-visibility: hidden;
	z-index: 999;
}

.modalView.show {
	opacity: 1;
	transform: scale(1);
	pointer-events: auto;
}

.flex_column {
	display: flex;
	flex-direction: column;
}

.backgroundColor-white {
	background-color: white;
}

.border_radius_10px {
	border-radius: 10px;
}

.padding1vh {
	padding: 1vh;
}

.posterImage {
	width: 60vw;
}

.flex_row {
	display: flex;
	flex-direction: row;
}

.marginTop2vh {
	margin-top: 2vh;
}
```

- 在 `script` 先设置data值

```javascript
data () {
	return {
		poster: {},
		qrShow: false,
		canvasId: 'ShareCanvasId',
	}
}
```

此处的canvasId值固定，用一个canvasId来在画板上绘画

- 利用 `async + await` 写同步请求，因为uni.request是封装的异步请求，此处需要同时渲染页面

```javascript
async shareFc(index) { //分享邀请二维码，参数index是列表点击的索引
	if (uni.getStorageSync('tmpIndex') === index) { //判断临时索引是否是点击的索引
		this.qrShow = true;
	} else {
		try{
			uni.setStorageSync('tmpIndex', index); //将点击的索引绑定给本地sync，作为临时索引
			let d = await getSharePoster({ //传入两个await参数，一个是类型，一个是canvasID
				// type: [this.classList[index].userid,this.classList[index].classid],
				type: 'testShareType',
				posterCanvasId: this.canvasId,
				qrCodeArray: (bgObj, type) => {
					return [{
						text: '二维码内容暂时不写', //后期可以传入相关的二维码参数，以便于扫码时获取
						// image: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1559644434957&di=0db394a4ae41b6cff704fa3d4cbd997b&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201806%2F30%2F20180630233629_GueV4.thumb.700_0.jpeg',
						size: 580, //二维码大小
						dx: (bgObj.width-580)/2, //x坐标
						dy: bgObj.height-1200 //y坐标
					}]
				},
				imagesArray: (bgObj, type) => { //接收的第一个参数为背景图片的信息, 第二个参数是自定义标识（感觉这里用不到）, 图片为示例图片
					return [{
						url: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1314428097,3858988978&fm=26&gp=0.jpg',
						dx: 100,
						dy: bgObj.height - 300,
						circleSet: { // 圆形图片
							circle: true
						},
						infoCallBack(imageInfo) {
							let scale = 200/imageInfo.height;
							return {
								dWidth: imageInfo.width*scale,
								dHeight: 200
							}
						}
					}]
				},
				setCanvasWH: (bgObj, type) => { // 为动态设置画布宽高的方法，
					this.poster = bgObj;
				},
				setDraw: (obj) => {
					let {
						Context,
						bgObj,
						type
					} = obj;
					Context.setFillStyle('black');
					Context.setGlobalAlpha(0.3);
					Context.fillRect(0, bgObj.height - 400, bgObj.width, 400);
					Context.setGlobalAlpha(1);
					Context.setFillStyle('white');
					Context.setFontSize(100);
					//输出姓名
					let text = uni.getStorageSync('realName');
					Context.fillText(text, bgObj.width - text.length * 50 - 160, bgObj.height - 175);
					//输出班级
					Context.setFillStyle('orange');
					Context.setFontSize(110);
					let textTitle = this.classList[index].classname;
					Context.fillText(textTitle, (bgObj.width - textTitle.length * 110)/2, bgObj.height - 430);
				}
			});
			console.log('海报生成成功， 临时路径: ' + d.poster.tempFilePath)
			this.poster.finalPath = d.poster.tempFilePath;
			console.log(this.poster.finalPath);
			this.qrShow = true;
		}catch(e){
			_app.hideLoading();
			_app.showToast(JSON.stringify(e));
			console.log(JSON.stringify(e));
		}
	}
},
	saveImage() {
		uni.saveImageToPhotosAlbum({
			filePath: this.poster.finalPath,
			success(res) {
				_app.showToast('保存成功');
			}
		})
	},
		share() {
			// #ifdef APP-PLUS
			_app.getShare(false, false, 2, '', '', '', this.poster.finalPath, false, false);
			// #endif

			// #ifndef APP-PLUS
			_app.showToast('分享了');
			// #endif
		},
			hideQr() {
				this.qrShow = false;
			}
```

## 扩展知识

**ES6的解构赋值**

```javascript
let {msg, data, status} = jsonData;
想调用 `msg` 就是 jsonData.msg;
这就是ES6的新语法糖

var a, b, rest;
[a, b] = [10, 20];
console.log(a); // 10
console.log(b); // 20
//直接交换位置

[a, b, ...rest] = [10, 20, 30, 40, 50];
console.log(a); // 10
console.log(b); // 20
console.log(rest); // [30, 40, 50]
// ...将剩余数组赋值给一个变量

({ a, b } = { a: 10, b: 20 });
console.log(a); // 10
console.log(b); // 20


// Stage 4（已完成）提案中的特性
({a, b, ...rest} = {a: 10, b: 20, c: 30, d: 40});
console.log(a); // 10
console.log(b); // 20
console.log(rest); // {c: 30, d: 40}
```

- 解析从函数中返回的数组

```javascript
function f() {
  return [1, 2];
}

var a, b; 
[a, b] = f(); 
console.log(a); // 1
console.log(b); // 2
```

- 也可以忽略掉返回值

```javascript
function f() {
  return [1, 2, 3];
}

var [a, , b] = f(); //也可以全部忽略 [,,]
console.log(a); // 1
console.log(b); // 3
```

- 举个例子，比如正则表达式验证

![mark](https://pic.yqqy.top/blog/20200111/4e6HB9OIhlir.png?imageslim "正则")

数组中有6个，我们只想要第一个怎么办？

![mark](https://pic.yqqy.top/blog/20200111/M8J8ONE2V90Y.png "选择合适的")

只需要省略掉其他的参数就行

- 解构对象

```javascript
var o = {p: 42, q: true};
var {p, q} = o;

console.log(p); // 42
console.log(q); // true
```

- 无需申明变量即可赋值

```javascript
({a, b} = {a: 1, b: 2});
console.log(a); // 1
console.log(b); // 2
```

- 给新的变量换名

```javascript
var o = {p: 42, q: true};
var {p: foo, q: bar} = o;
 
console.log(foo); // 42 
console.log(bar); // true
```