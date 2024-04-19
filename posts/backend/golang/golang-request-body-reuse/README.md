---
title: "Golang的Request.Body复用"
description: "在写路由中间件时有一个需求，去获取Request携带的参数然后去拦截是否合法，这时候在下游的Controller层再次去获取body竟然发现结果为空，特此记录原因和解决方案"
date: 2020-12-19 13:56:15
categories: ["后端"]
tags: ["Golang"]
---

# Golang的Request.Body复用

::: tip 背景
在写路由中间件时有一个需求，去获取Request携带的参数然后去拦截是否合法，这时候在下游的Controller层再次去获取body竟然发现结果为空，特此记录原因和解决方案
:::

由于`http.Request.Body`是`io.ReadCloser`类型，所以需要带有无操作close方法的ReadCloser去复制

## 解决方案

```go
// 假设r是http.Request类型
// 我们拿到body字节流数据
b, _ := ioutil.ReadAll(r.Body)

// 用该方法继续将数据写入Body用于传递
r.Body = ioutil.NopCloser(bytes.NewBuffer(b))
```

## 分析原因

大多数Http框架都是这样实现的，只读一次，是因为持有的缓冲区的指针都是往前读的，如果一直持有缓冲区而不释放会出问题，可以想象一下，假如可以多次重复读，那么用户连接所产生的的内存占用的缓冲区有多大呢？什么时候释放呢？

在实际开发中，响应主体持有的资源可能会很大，所以并不会将其直接保存在内存中，只是持有数据流连接。当我们需要时，才会从服务器获取数据并返回。同时，考虑到应用重复读取数据的可能性很小，所以将其设计为`一次性流（one-shot）`,即“读取后立即关闭并释放资源”。
