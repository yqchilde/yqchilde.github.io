---
title: "Ubuntu启动Docker报没有权限"
description: "解决Ubuntu启动Docker 'Got permission denied while trying to connect to the Docker daemon socket' 问题。"
date: 2020-11-11 08:11:30
tags: ["Ubuntu", "Docker"]
---

# Ubuntu启动Docker报没有权限

## 问题描述

解决Ubuntu启动Docker "Got permission denied while trying to connect to the Docker daemon socket" 问题。在终端执行 `docker version `命令，出现以下错误

![image-20201111081455844](https://pic.yqqy.top/blog/20201111081457.png "docker version")

## 原因分析

docker进程使用 Unix Socket 而不是 TCP 端口。而默认情况下，Unix socket 属于 root 用户，因此需要 **root权限** 才能访问。

## 解决方案

将 docker 添加进用户组，代码如下，依次执行：

```bash
1. 添加docker用户组
sudo groupadd docker

2. 检测当前用户是否已经在docker用户组中，其中XXX为系统用户名
sudo gpasswd -a $XXX docker

3. 将当前用户添加至docker用户组
sudo gpasswd -a $USER docker

4. 更新docker用户组
newgrp docker
```

![image-20201111081917641](https://pic.yqqy.top/blog/20201111081918.png "解决方案")

## 检查结果

再次执行 `docker version` 命令，发现不再出现缺失权限的问题

## 参考文章

* [解决Ubuntu18.04启动Docker“Got permission denied while trying to connect to the Docker daemon socket“问题](https://blog.csdn.net/liangllhahaha/article/details/92077065)