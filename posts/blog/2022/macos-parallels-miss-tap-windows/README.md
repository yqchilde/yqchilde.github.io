---
title: "解决在 Apple M1 上使用 Parallels 安装 Windows 后无法使用 OpenVPN 的问题"
description: "由于工作需要，我在 macOS 上安装 Windows，但是在 Windows 上却无法使用 OpenVPN。"
date: 2022-04-18 15:03:51
tags: ["MacOS"]
---

# 解决在 Apple M1 上使用 Parallels 安装 Windows 后无法使用 OpenVPN 的问题

在安装 `openVpn` 的最后步骤报错如下:

```text
There are no TAP-Windows adapters on this system.  You should be able to create a TAP-Windows adapter by going to Start -> All Programs -> TAP-Windows -> Utilities -> Add a new TAP-Windows virtual ethernet adapter.
```

虽然报错，但是提示安装完成，打开后，果不其然，无法连接

打开设备管理器 > 网络适配器 查看，并没有 `TAP-Windows Adapter V9` 适配器

解决办法如下：

1. 下载 [OpenVPN](https://www.aliyundrive.com/s/9ZjEohW4JTs) 客户端 (提取码 4f5c)，并安装，安装好后再次查看网络适配器，应该有 `TAP-Windows Adapter V9` 适配器，如下：

![](https://pic.yqqy.top/blog/202204181522517.png)

2. 再次进行测试连接

![](https://pic.yqqy.top/blog/202204181529411.png)