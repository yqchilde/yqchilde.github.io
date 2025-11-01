---
title: "Uni-App之携带session请求"
description: "记载一下uniapp携带session的请求"
date: 2019-07-11 13:58:33
tags: ["UniAPP"]
---

# Uni-App之携带session请求

## header请求头

在uniapp里面uni.request是类似于ajax的异步请求，请求适合可以携带header头，那我们给header头加一个cookie信息即可，如下

```javascript
let headers = {};
headers['content-type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
let PHPSESSID = uni.getStorageSync('PHPSESSID');
if (PHPSESSID) {
	headers['cookie'] = 'PHPSESSID=' + PHPSESSID;
}
```

将session放在header这个对象里面，同理当然也可以写其他需要的cookie信息