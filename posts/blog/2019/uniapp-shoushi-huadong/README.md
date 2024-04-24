---
title: "Uni-App的手势监听滑动"
description: "官方文档上面只有说支持 `touchmove` 但是却没给一个demo，实现过程在这里了。"
date: 2019-06-15 07:10:11
tags: ["UniAPP"]
---

# Uni-App的手势监听滑动

## 踩坑

官方文档上面只有说支持 `touchmove` 但是却没给一个demo

## 效果图
![mark](https://pic.yqqy.top/blog/2017uniapphuadong.gif "效果图")

## 代码如下

```html
<template>
	<view class="page" @touchmove="touchRight" @touchstart="touchStart" @touchend="touchEnd">
		<uni-drawer :visible="showLeft" mode="left" @close="closeDrawer('left')"> <!-- @close="closeDrawer('left')" -->
			<uni-list-item title="Item1" />
			<uni-list-item title="Item2" />
			<uni-list-item :show-badge="true" title="Item3" badge-text="12" />
		</uni-drawer>
	</view>
</template>
```

```javascript
<script>
	import uniDrawer from "@/components/uni-drawer/uni-drawer.vue"
	import uniList from '@/components/uni-list/uni-list.vue'
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue'
	var that;
	
	export default {
		components: {
			uniDrawer,
			uniList,
			uniListItem
		},
		data() {
			return {
				showLeft: false,
				flag: 0,
				text: '',
				lastX: 0,
				lastY: 0,
			}
		},
		onLoad() {
			that = this;
		},
		methods: {
			showDrawer: function(e) {
				if (e === 'left') {
					that.showLeft = true
				}
			},
			closeDrawer: function(e) {
				if (e === 'left') {
					that.showLeft = false
				}
			},
			touchRight: function(e) { // 向右移动
				console.log("移动中");
				if (that.flag !== 0) {
					return;
				}
				let currentX = e.touches[0].pageX;
				let currentY = e.touches[0].pageY;
				let tx = currentX - that.lastX;
				let ty = currentY - that.laseY;
				let text = "";
				that.mindex = -1;
				//左右方向滑动
				if (Math.abs(tx) > Math.abs(ty)) {
					if (tx < 0) {
						text = '向左滑动';
						that.flag = 1;
						// that.closeDrawer('left');
						console.log(text);
					} else if (tx > 0) {
						text = '向右滑动';
						that.flag = 2;
						that.showDrawer('left');
						console.log(text);
					}
				}
			},
			// touchTop: function(e) { // 上下移动
            //     if (that.flag !== 0) {
            //         return;
            //     }
            //     let currentX = e.touches[0].pageX;
            //     let currentY = e.touches[0].pageY;8
            //     let tx = currentX - that.lastX;
            //     let ty = currentY - that.laseY;
            //     that.mindex = -1;
            //     if (Math.abs(tx) <= Math.abs(ty)) { //上下方向滑动
            //         if (ty < 0) { //向上滑动
            //             this.flag = 1;
            //             this.floatButton = 'inline';
            //         } else if (ty > 0) { // 向下滑动
            //             this.flag = 2;
            //             this.floatButton = 'none'
            //         }
            //     }
            //     
            //     this.lastX = currentX;
            //     this.lastY = currentY;
            // },
			touchStart: function(e) { //开始移动
				console.log("开始移动");
				// that.showDrawer('left');
				that.lastX = e.touches[0].pageX;
				that.laseY = e.touches[0].pageY;
			},
			touchEnd: function(e) { // 结束移动
				console.log("结束移动");
				that.flag = 0;
				that.text = "没有滑动"
			}
		}
	}
</script>
```