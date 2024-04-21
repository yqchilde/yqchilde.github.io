---
title: "golang写的web程序如何简单的部署到宝塔面板中"
description: "golang web程序部署到宝塔面板中，并常驻后台的方法"
date: 2019-12-14 11:25:02
categories: ["后端"]
tags: ["Golang"]
---

# golang写的web程序如何简单的部署到宝塔面板中

:::tip 🤔?
写好的go web 如何在不配置环境的情况下部署到宝塔呢
:::

## 描述
 
写好了，如何部署在服务器上，毕竟本地没法给别人用，不多BB

1. 发挥golang的交叉编译功能，我服务器是linux，那我们先编译成linux

2. 先去查看一下我们服务器的型号 `uname -a`，确认是amd64
   ![mark](https://pic.yqqy.top/blog/20200111/fwo1S6NLmwub.png "确认编译类型")

3. GOOS：目标平台的操作系统（darwin、freebsd、linux、windows） 
   GOARCH：目标平台的体系架构（386、amd64、arm） 
   交叉编译不支持 CGO 所以要禁用它

4. Terminal执行以下四个命令

   * `SET CGO_ENABLED=0`
   * `SET GOOS=linux`
   * `SET GOARCH=amd64`
   * `go build main.go`

5. 打包完之后有一个`main`程序，没有后缀

   ![mark](https://pic.yqqy.top/blog/20200111/GxH2poCkqRq6.png "编译后文件")

6. 在宝塔面板文件中创建一个文件夹，将这个文件上传上去

7. 我们在终端中进入这个文件目录，然后`./main`就可以跑起来了

   ![mark](https://pic.yqqy.top/blog/20200111/ttqcIXyxsRIS.png "服务器")

8. 注意：golang的http已经开启了一个端口，那我们需要去开启安全组对应的端口，之后跑起来就可以用`ip:port`来访问了

9. 如果想通过访问域名来访问到golang的程序，那么我们需要了解`nginx`的反向代理知识

   * 宝塔面板有傻瓜式设置反向代理
   * 设置完了之后就可以通过域名访问了

   ![mark](https://pic.yqqy.top/blog/20200111/UiqC3zNM6KBK.png "宝塔设置代理")

## 保活

1. 没有后台运行，当我们关掉终端就会结束掉程序，那有什么意义呢

2. 了解一下linux的screen命令

* 下载screen `yum install screen`

3. 【终端操作】 （需要在物理shell中操作）

   * screen -S name  创建 名为name的 screen
   * screen -a 然后 d 暂时离开此screen 后台继续运行
   * screen -ls 列出所有screen 进程 pid 与名称
   * screen -r  + pid（或者名称）回到screen(attached状态）,如果就一个screen进程，可以省略 pid

4. 【终端中的窗口操作】（挂载某个终端）

   * **Ctrl+a c** ：创建窗口
   * **Ctrl+a w** ：窗口列表
   * **Ctrl+a n** ：下一个窗口
   * **Ctrl+a p** ：上一个窗口
   * **Ctrl+a 0-9** ：在第0个窗口和第9个窗口之间切换
   * **Ctrl+a K(大写)** ：关闭当前窗口，并且切换到下一个窗口（当退出最后一个窗口时，该终端自动终止，并且退回到原始shell状态）
   * **exit** ：关闭当前窗口，并且切换到下一个窗口（当退出最后一个窗口时，该终端自动终止，并且退回到原始shell状态）
   * **Ctrl+a d** ：退出当前终端，返回加载screen前的shell命令状态

5. **如何关闭一个终端？**
   如果需要关闭一个终端，可以先进入此终端，然后将所有窗口关闭，当所有窗口都关闭的时候，终端自动关闭，并且出现“[screen is terminating]”。

   具体命令如下

   ```shell
   // 1. 关闭某个进程
   screen kill pid / Screen -S pid -X quit
   
   // 2. 关闭全部进程
   screen killall
   
   // 3. 在进程中关闭
   exit / ctrl+c
   ```


![mark](https://pic.yqqy.top/blog/20200111/ym3qOaGiSJIL.png "运行图")