---
title: "GoModule添加私有仓库(包会)"
description: "本篇记载了如何添加gitlab/github私有仓库到go mod中使用，并且可以使用go get命令获取到私有仓库的依赖。"
date: 2022-04-17 22:38:34
tags: ["Golang"]
---

# GoModule添加私有仓库(包会)

::: tip
GoModule添加私有仓库只需要三步就搞定了👌  
1.设置go env😯  
2.配置ssh秘钥😅  
3.全局替换https请求为ssh请求😆
:::

## 1. 设置go env

```bash
# 1. (设置私有仓库的git地址，这要看你的go.mod中的私有仓库地址)
# 比如gitlab的私有仓库是 https://gitlab.xxx.cn，就如下设置
go env -w GOPRIVATE="https://gitlab.xxx.cn"
# 如果是github的私有仓库，比如 https://github.com/company/repo，就如下设置
go env -w GOPRIVATE="https://github.com/company"

# 2. (xxx和上面地址一样，其实执行完1，GONOPROXY和GONOSUMDB会自动设置，可以go env查看)
# 设置请求该地址不需要代理，即GOPROXY
go env -w GONOPROXY="xxx"
# 设置不验证sum包的签名
go env -w GONOSUMDB="xxx"

# 3. (这个设置的前提是你公司的gitlab没有配置https)
# 允许设置不安全访问，跳过证书校验，配置后可请求到 http 地址的仓库
go env -w GOINSECURE="xxx"
``` 

## 2. 配置ssh秘钥

推荐看一下我写的这篇文章，文章详情请点击：👉 [Git 多账户配置](../../workflow/git/multi-account)

## 3. 全局替换https请求为ssh请求

`go mod tidy/download` 拉取包时默认都是https请求，所以需要替换为ssh请求，如下：

```bash
# gitlab
$ git config --global url."ssh://git@gitlab-company".insteadOf "https://gitlab.xxx.cn"

# github的同理
$ git config --global url."ssh://git@github-company".insteadOf "https://github.com"
```

**现在已经可以正常拉到私有仓库包了👌**

## 4. gitlab额外配置.netrc

*第四大步骤只需要gitlab私有仓库阅览，github的无需阅读*

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