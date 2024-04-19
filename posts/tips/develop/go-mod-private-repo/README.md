---
title: "GoModule添加gitlab私有仓库"
description: "本篇记载了如何添加 gitlab 私有仓库到 go mod 中使用，并且可以使用 go get 命令获取到私有仓库的依赖。"
date: 2022-04-17 22:38:34
categories: ["奇技淫巧"]
tags: ["Golang"]
---

# GoModule添加gitlab私有仓库

## 1. 设置env

```bash
# 设置私有仓库的git地址
go env -w GOPRIVATE="git@gitlab.xxx.cn"

# 允许设置不安全访问，配置后可请求到 http 地址的仓库
go env -w GOINSECURE="gitlab.xxx.cn"

# 设置请求该地址不需要代理，即GOPROXY
go env -w GONOPROXY="gitlab.xxx.cn"

# 设置不验证sum包的签名
go env -w GONOSUMDB="gitlab.xxx.cn"
```

## 2. 配置秘钥

如果要拉取的库是私有的，需要配置秘钥，可以使用以下命令：

```bash
# 1. 创建私有仓库的秘钥 （该步骤省略，每个平台不一样）

# 2. 设置秘钥
$ git config --global http.extraheader "PRIVATE-TOKEN:上面配置的秘钥"
```

## 3. 全局替换ssh请求为http请求

这一步是为了解决不方便用ssh拉取时，选用http拉取

```bash
$ git config --global url."git@gitlab.xxx.cn".insteadOf "https://gitlab.xxx.cn"
```

## 4. 配置 .netrc

这一步可以直接省略第 2、3 两个步骤，直接使用 .netrc 文件（文件路径： ~/.netrc ），如下：

```bash
machine gitlab.xxx.cn login 用户名 password 上面设置的秘钥
```

使用该步骤还可以解决掉一个 `gitlab` 的一个不能拉取子组库的问题: [Go get fails with the usage of subgroups](https://gitlab.com/gitlab-org/gitlab-foss/-/issues/30785)，比如：

```bash
# 如下拉取命令如果不使用步骤4的话就会报错 
# 因为由于gitlab的限制，最多只能拉取到一个层级，即 gitlab.xxx.cn/a/b.git
$ go get -u gitlab.xxx.cn/a/b/c.git
```