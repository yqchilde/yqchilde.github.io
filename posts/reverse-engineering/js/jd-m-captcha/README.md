---
sort: 1
title: "某东M端登录滑块分析学习"
description: ""
date: 2024-08-06 23:42:59
tags: ["逆向笔记"]
---

# 某东M端登录滑块分析学习

:::tip
**本分类中所有文章仅代表博主个人学习分享，不用于其他任何目的，不提供完整代码，只做学习笔记，抓包内容、敏感网址、数据接口已进行脱敏处理，如有侵权，请联系博主删除。**
:::


## 分析目标

目标：某东M端登录滑块  
网址：aHR0cHM6Ly9wbG9naW4ubS5qZC5jb20vbG9naW4vbG9naW4=

## 抓包分析

进入之后先清理网站数据再刷新，输入手机号，点击获取验证码，到此开始从后往前分析包

![img](./20240806100.png)

![img](./20240806100.1.png)

![img](./20240806100.2.png)

![img](./20240806100.3.png)

**check** 接口是获取滑块验证码图片的，也是提交滑块数据的，响应`img`值里是图片数据，如果提交滑块数据错误会报错

![img](./20240806100.4.png)

**fp** 接口里需要知道`si`（jcapsid接口返回的（jcap_sid））、`ct`怎么来的，看起来是一些指纹信息

![img](./20240806100.5.png)

**jcapsid** 接口需要知道以下参数计算
* **st**: 搜了下在`new_login_entrance`的响应里
* **risk_jd[fp]**: **需要计算**
* **risk_jd[token]**: 搜了下在`m.html`里
* **risk_jd[jstub]**: **需要计算**
* **risk_jd[fpstep]**: nb + 时间戳

## 逆向分析

所以一共需要分析出以下参数
1. *jcapsid* 接口 **risk_jd[fp]、risk_jd[jstub]**
2. *fp* 接口 **ct**
3. *check* 接口 **tk、ct**


### 1.jcapsid - risk_jd[fp]

整体搜索一下`risk_jd[fp]`，搜到几个结果，挨个打开一下，最后定位到了图中所示位置，此时`risk_jd[fp]: r.fp`，所以要继续看`r.fp`的值

![img](./20240806101.png)

在上方看到`r`的值，`fp`属性在其中，通过`r = getJdEid()`知道`r`是怎么来的，断点跟入

![img](./20240806102.png)

跟进来之后看到`fp: risk_jd_local_fingerprint`，这就知道怎么来的了

![img](./20240806103.png)

搜一下关键词又发现`risk_jd_local_fingerprint = t`，且`t`是函数传进来的，那么就跟一下栈

![img](./20240806104.png)

跟进来后看出这个函数参数`b`就是`t`，`b = this.x64hash128(c.join("~~~", 31);`，其中`c`是各种指纹信息

![img](./20240806105.png)

这个`x64hash128`函数是开源项目 [fingerprintjs](https://github.com/fingerprintjs/fingerprintjs) 的方法，本地模拟一下，成功算出

![img](./20240806106.png)

### 2.jcapsid - risk_jd[jstub]

和`risk_jd[fp]`一样，找到js中的位置，看出来`jstub`的值是`jd_shadow__`

![img](./20240806107.png)

在文件中搜一下来源，看出来是一个AES加密算法，扣一下算法

![img](./20240806108.png)

缺啥函数补啥函数，搞定

![img](./20240806109.png)

### 3.fp - ct

滑块中显示的图片是`ct`参数

![img](./20240806110.png)

跟一下调用栈

![img](./20240806111.png)

进入js中，搜一下`ct =`，定位到如图位置  
所以`ct`就是用`pt(o.RfeFa(vt, m) + o.FSiZM(gt, y.si[e("0x4c") + "gth"], 4) + y.si + d + c, l, v)`计算的

![img](./20240806112.png)

从后往前分别找一下参数，先看参数`v`，搜一下`v`的值，发现`l`和`v`都在`requireCaptcha.js`这个文件中

![img](./20240806113.png)

`c`的值是时间戳，Date.parse(new Date)  
`d`的值看起来是一些手机号，wgl等环境参数  
`y.si`是前文`jcapsid`接口中的`jcap_sid`

![img](./20240806114.png)

接着看`o.FSiZM(gt, y.si[e("0x4c") + "gth"], 4)`  
1. 其中`FSiZM`函数接收3个参数，其内部实现是`t(e, n)`，也就是可以变成`o.FSiZM(gt(y.si[e("0x4c") + "gth"], 4))`  
2. `e("0x4c") + "gth"`，执行得出`length`，所以又可以变成`o.FSiZM(gt(y.si["length"], 4))`  
3. 那么`gt`函数是啥？扣一下
```js
function gt(t, e) {
    for (let o = t.toString().length; o < e;) {
        t = "0" + t;
        o++;
    }
    return t
}
```

再往前是`o.RfeFa(vt, m)`，搜一下m是什么，`m=时间戳%19`

![img](./20240806115.png)

![img](./20240806116.png)

`vt`函数也同理，扣一下算法

```js
function vt(t) {
    for (var e = function (t, e) {
        return a(t - -322, e)
    }, n = {
        kuqKR: function (t, e) {
            return t < e
        }
    }, r = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"], o = "", i = 0; n.kuqKR(i, t); i++) {
        o += r[Math.floor(35 * Math.random())]
    }
    return o
}
```

`o.RfeFa`和`FSiZM`一样，等于vt(m)

最后只差`pt`方法了，跟个断点走进去。return 后面跟着一个三元表达式，两个结果分别查看一下

![img](./20240806117.png)

根据结果断定是前一种，拆开第一种发现，前面是一个`JSON.stringify()`，后面是一个加密函数

![img](./20240806118.png)

继续跟进去加密函数，未完待续...

### 4.check - tk、ct