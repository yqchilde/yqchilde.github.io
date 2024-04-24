---
title: "MacOS-如何删除Free Space，使得APFS容器将Free Space占用"
description: "折腾来折腾去又回到了windows，因为一块2k屏抛弃了体验良好的黑苹果，由于装了企业版，发现企业版不会带Microsoft Store，故查资料发现了解决方法，此文插眼记录。"
date: 2020-11-08 18:40:25
tags: ["Windows"]
---

# win10企业版缺失Microsoft Store及一键切换版本

::: info
折腾来折腾去又回到了windows，因为一块2k屏抛弃了体验良好的黑苹果，由于装了企业版，发现企业版不会带Microsoft Store，故查资料发现了解决方法，此文插眼记录。
:::

## 下载包

打开网址 [Microsoft Store - Generation Projec](https://store.rg-adguard.net)

以 PackageFamilyName 方式搜索 `Microsoft.WindowsStore_8wekyb3d8bbwe`

根据系统选择对应的包，一共需要下载4个安装包（每类种选择一个）都要下载(64位可以下载32的，32只下载32的就可)

![image-20201108190353787](https://pic.yqqy.top/blog/20201108190857.png "选择版本")

## 安装包

以上下载的文件放在同一个文件夹中，然后在当前目录打开Powershell，执行如下命令进行安装

```bash
Add-AppxPackage *
```

随后看到进度条下载中就说明ok，然后就可以搜到Store应用了

## win一键切换版本

企业版太不适合开发党了，想下载个新版 Terminal版本都不够，只能切换到专业版了

![image-20201108191221252](https://pic.yqqy.top/blog/20201108191223.png "一键切换软件")

* **下载地址：**[https://www.lanzouw.com/ihWfli71vzc](https://www.lanzouw.com/ihWfli71vzc) 密码:2vgu

## 参考文章
* [windows ltsc版本没有Microsoft Store怎么解决](https://blog.csdn.net/ganquanzhong/article/details/98250380)