---
title: "解决win10的cmd命令行不转义ANSI序列（让cmd输出彩色字体）"
description: "简单来说就是装了之后能在cmd中通过一些代码实现华丽的效果，比如改变字体颜色"
date: 2020-01-11 10:26:10
tags: ["Terminal"]
---

# 解决win10的cmd命令行不转义ANSI序列（让cmd输出彩色字体）

## 什么是ANSI序列

ANSI转义序列是一种带内信号的转义序列标准，用于控制视频文本终端上的光标位置、颜色和其他选项。在文本中嵌入确定的字节序列，大部分以ESC转义字符和"["字符开始，终端会把这些字节序列解释为相应的指令，而不是普通的字符编码。

ANSI序列是在二十世纪七十年代引入的标准，用以取代特定于终端供应商的序列，并在二十世纪八十年代早期开始在计算机设备市场上广泛使用。与早期缺少光标移动功能的系统相比，新生的电子公告板系统使用ANSI序列改进其显示。正是因为这个原因，ANSI序列变成了所有制造商共同采用的标准。

简单来说就是装了之后能在cmd中通过一些代码实现华丽的效果，比如改变字体颜色

## 安装

1. 从[这里](https://github.com/adoxa/ansicon/releases)下载最新文件，解压

2. 选择自己的电脑需要的配置

   ![mark](https://pic.yqqy.top/blog/20200111/PtEwQgNosvfj.png)

   ![mark](https://pic.yqqy.top/blog/20200111/Wa5AQmQeh1H1.png)

3. 路径行输入cmd快捷进入当前路径下的cmd窗口

4. 执行下面两行代码进行安装

   ```shell
   ansicon.exe -i
   ansicon.exe -l
   ```

## 效果展示

* **原来效果**

  ![mark](https://pic.yqqy.top/blog/20200111/maNVT3Wcio8H.png)

* **现在效果**

  ![mark](https://pic.yqqy.top/blog/20200111/y4lANsHxEczi.png)

## 参考博客

* [cmd输出彩色字体（win10 cmd控制台支持ANSI转义序列）](https://www.cnblogs.com/naiij/p/9772584.html)