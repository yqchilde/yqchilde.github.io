---
title: "Ubuntu 下关于 Netplan 的一次报错"
description: "一次错把 netplan 当做 netplan.io 使用时发生的报错。"
date: 2022-04-17 19:30:38
categories: ["奇技淫巧"]
tags: ["Ubuntu"]
---

# Ubuntu 下关于 Netplan 的一次报错

::: tip 背景
故事发生在一次使用 [netplan apply] 中，原本项目中是使用 [netplan] 做静态ip设置的工具，但是当我在使用时，发生了以下报错，特以此篇记录。
:::

报错如下：

```shell
$ netplan apply

bind: Address already in use
netplan: fatal error: cannot bind to port 2983, is another daemon running?, exiting.
```

在 ubuntu 中存在两个软件 `netplan` 和 `netplan.io` ，前者是 "计划" 的网络服务器，后者是根据 YAML 配置的网络配置工具，他们本来是同一款软件，但是在 ubuntu 中，netplan的计划日历服务有问题，所以要换成 `netplan.io` 使用，结局方案如下：

```shell
$ apt remove netplan
$ apt install netplan.io
```