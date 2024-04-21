---
title: "uniapp生成随机验证码&php合成验证码图片"
description: "我搞了3天用php生成验证码，然后session返回验证码的值，这样子直接请求是可以的，但是在小程序里面是只能获取到 `PHPSESSID` ，所以要带着图片的sessionid才能访问到正确的验证码值，奈何在uniapp里面，uni.request请求才能拿到sessionid，但是image标签要想显示这个session的对应的图片，需要动态绑定数据加载，这样就导致了加载的图片请求了一次session，request又请求了一次，我技术不高写不出来了，这才想到了今天要实现的这种方法"
date: 2019-07-11 15:06:07
categories: ["前端"]
tags: ["UniAPP"]
---

# uniapp生成随机验证码&php合成验证码图片

::: tip 背景
我搞了3天用php生成验证码，然后session返回验证码的值，这样子直接请求是可以的，但是在小程序里面是只能获取到 `PHPSESSID` ，所以要带着图片的sessionid才能访问到正确的验证码值，奈何在uniapp里面，uni.request请求才能拿到sessionid，但是image标签要想显示这个session的对应的图片，需要动态绑定数据加载，这样就导致了加载的图片请求了一次session，request又请求了一次，我技术不高写不出来了，这才想到了今天要实现的这种方法。
:::

## 代码如下

### template代码如下

```html
<modal-view title="请输入验证码" :no-cancel='true' confirm-text='确定' :hidden.sync='modalHidden'>
	<view slot='text' class="verifyCode">
		<image id="verifyCode" :src="verifySrc" mode="aspectFit" @click="getRandomCode"></image>
	</view>
</modal-view>
```

### script代码如下

```javascript
getRandomCode: function() { // 生成验证码
	let code = new Array();
	let codeLength = 6;//验证码的长度
	let selectChar = new Array(2,3,4,5,6,7,8,9,'a','b','c','d','e','f','g','h','j','k','l','m','n','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','J','K','L','M','N','P','Q','R','S','T','U','V','W','X','Y','Z');
	for(let i=0;i<codeLength;i++) {
		let charIndex = Math.floor(Math.random()*56); // 56是selectChar数组的长度
		code +=selectChar[charIndex];
	}
	if(code.length != codeLength) {
		this.getRandomCode();
	}
	uni.request({
		url: this.verifySrc = that.apiServer + 'user&m=verifyView',
		method: 'POST',
		responseType:'arrayBuffer', //设置responseType是为了转化图片为base64
		header : {'content-type':'application/x-www-form-urlencoded'},
		data: {
			code
		},
		success: res => {
			let verifyImg = 'data:image/jpeg;base64,' + uni.arrayBufferToBase64(res.data); // 设置图片动态绑定的src路径
			this.verifySrc = verifyImg;
		},
		fail: (res) => {
			console.log("请检查网络");
		}
	});
}
```
**注意：** 不转化为base64的话图片是

![mark](https://pic.yqqy.top/blog/20200111/6B1C0MqdMPD3.png "未转base64")

## php端代码

控制器代码

```php
<?php
/**
 * User: yqchilde
 * Date: 2019/7/1
 * Time: 22:06
 */

namespace dnC;

class user
{
    public function verifyView()
    {
        if (isset($_POST['code'])) {
            $imgModel = new \dncTool\verifyImage();
            $imgModel->build($_POST['code']);
        } else {
            exit(jsonCode('error', '获取二维码失败'));
        }
    }
}
```

verifyImage代码

```php
<?php
/**
 * 验证码类
 * User: yqchilde
 * Date: 2019/7/6
 * Time: 21:55
 */

namespace dncTool;

class verifyImage {
    public function __construct() {
        $this->font = 'simhei.ttf';
    }

    static function create(){
        static $instance ;
        if (!$instance){
            $instance = new verifyImage();
        }
        return $instance;
    }

    private $code;//验证码
    private $codeLen = 6;//验证码长度
    private $width = 130;//宽度
    private $height = 50;//高度
    private $img;//图形资源句柄
    private $font;//指定的字体
    private $fontsize = 20;//指定字体大小
    private $fontcolor;//指定字体颜色

    //生成随机码
    private function createCode($code) {
        $this->code .= $code;
    }
    //生成背景
    private function createBg() {
        $this->img = imagecreatetruecolor($this->width, $this->height);
        $color = imagecolorallocate($this->img, mt_rand(157,255), mt_rand(157,255), mt_rand(157,255));
        imagefilledrectangle($this->img,0,$this->height,$this->width,0,$color);
    }
    //生成文字
    private function createFont() {
        $_x = $this->width / $this->codeLen;
        //$this->code = array("天", "地", "人", "和", "梦",);//随机因子
        for ($i=0;$i<$this->codeLen;$i++) {
            $this->fontcolor = imagecolorallocate($this->img,mt_rand(0,156),mt_rand(0,156),mt_rand(0,156));
            imagettftext($this->img,$this->fontsize,mt_rand(-30,30),$_x*$i+mt_rand(1,5),$this->height / 1.4,$this->fontcolor,$this->font,$this->code[$i]);
        }
    }
    //生成线条、雪花
    private function createLine() {
        //线条
        for ($i=0;$i<6;$i++) {
            $color = imagecolorallocate($this->img,mt_rand(0,156),mt_rand(0,156),mt_rand(0,156));
            imageline($this->img,mt_rand(0,$this->width),mt_rand(0,$this->height),mt_rand(0,$this->width),mt_rand(0,$this->height),$color);
        }
        //雪花
        for ($i=0;$i<100;$i++) {
            $color = imagecolorallocate($this->img,mt_rand(200,255),mt_rand(200,255),mt_rand(200,255));
            imagestring($this->img,mt_rand(1,5),mt_rand(0,$this->width),mt_rand(0,$this->height),'*',$color);
        }
    }
    //输出
    private function outPut() {
        header('Content-type:image/png');
        imagepng($this->img);
        imagedestroy($this->img);
    }
    //对外生成
    public function vCodePicture($code) {
        $this->createBg();
        $this->createCode($code);
        $this->createLine();
        $this->createFont();
        $this->outPut();
    }
    //获取验证码
    public function getCode() {
        return strtolower($this->code);
    }

    public function build($code)
    {
        $this->vCodePicture($code);
    }
}
```

## 看一下最后的样子

![mark](https://pic.yqqy.top/blog/20200111/jNEimhVRAk2K.png "效果图")