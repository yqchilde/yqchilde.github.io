---
title: 解决Ubuntu桌面版无法显示画面问题
description: 在VmWare虚拟机中从ubuntu20.04升级到24.04后，可能存在部分步骤执行失败，导致无法进入桌面显示画面
date: 2025-08-04 10:23:00
tags:
  - Ubuntu
---

# 解决Ubuntu桌面版无法显示画面问题

## 卸载重装Nvidia驱动(非必要)

非必要是因为有些机器没有，会执行失败，忽略即可

```shell
sudo apt purge nvidia-*

sudo apt autoremove

sudo nvidia-uninstall
```

## 重装gdm3

```shell
sudo apt purge gdm gdm3

sudo apt install gdm3 

sudo apt install ubuntu-desktop
```

随后重启 gdm 即可

```shell
systemctl restart gdm
```
