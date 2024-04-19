---
title: "玩软路由的一些笔记"
description: "玩软路由也有两个月了，逐渐开始不想折腾了，特此记录一下一些配置，以防止日后生疏忘记。"
date: 2022-08-29 08:49:39
categories: ["奇技淫巧"]
tags: ["软路由"]
---

# 玩软路由的一些笔记
::: danger 吐槽
本文开始之前要批评一款软路由产品《以N5105这颗CPU制作的软路由成品》，这是一台被某些UP吹起来的机器，说句垃圾不为过吧毕竟很多人整天为了它心烦，在发本文时N5105我已经出手卖掉而且仍有不兼容的问题，主要表现在PVE虚拟机上再虚拟化一些服务出来会有概率卡死机问题，以及其他的兼容性问题，售后群里天天都能看到吐槽的，大无语了，咸鱼是它最好的归属。
:::

::: tip 赞
本文使用的机器是《以奔腾7505这颗CPU制作的软路由成品》，目前用了有一周了，在PVE下第一次感觉到这么的稳定。
:::

## 虚拟机服务

### iKuai

#### 安装
博主使用iKuai作为主路由，起拨号上网以及其他网络管理功能

固件下载地址： [https://www.ikuai8.com/component/download](https://www.ikuai8.com/component/download)，下载ISO镜像导入到pve-local里，如图

![img](https://pic.yqqy.top/blog/202208290958939.png)

1. 右上角点击 <创建虚拟机>

![](https://pic.yqqy.top/blog/202208291013559.png)

2. 操作系统配置

![](https://pic.yqqy.top/blog/202208291014407.png)

3. 系统配置

![](https://pic.yqqy.top/blog/202208291014310.png)

4. 磁盘配置

![](https://pic.yqqy.top/blog/202208291048429.png)

5. CPU配置

![](https://pic.yqqy.top/blog/202208291055653.png)

6. 内存配置

![](https://pic.yqqy.top/blog/202208291056704.png)

7. 网络配置

![](https://pic.yqqy.top/blog/202208291058116.png)

8. 网卡直通

![](https://pic.yqqy.top/blog/202208291112421.png)

![](https://pic.yqqy.top/blog/202208291124108.png)

9. 修改引导顺序

![](https://pic.yqqy.top/blog/202208291114446.png)

#### iKuai配置

待补充

### openwrt

#### 安装

0. 由于博主使用openwrt仅做旁路由，估不需要直通网卡
1. 博主使用了esir的固件安装，网盘地址[https://drive.google.com/drive/folders/1uRXg_krKHPrQneI3F2GNcSVRoCgkqESr](https://drive.google.com/drive/folders/1uRXg_krKHPrQneI3F2GNcSVRoCgkqESr)，博主用的插件少，仅选择精品小包，选择最新的 `uefi.img.gz` 结尾的镜像下载到本地。使用命令 `gzip -d 镜像目录` 解压镜像得到 `.img` 结尾的镜像。
2. 上传镜像，同ikuai上传一样方式，上传到pve-local，提前复制好上传后保存的路径
3. 右上角点击 <创建虚拟机>

![](https://pic.yqqy.top/blog/202208291153945.png)

4. 操作系统配置

![](https://pic.yqqy.top/blog/202208291155143.png)

5. 系统配置

![](https://pic.yqqy.top/blog/202208291014310.png)

6. 磁盘配置

![](https://pic.yqqy.top/blog/202208291335935.png)

7. CPU配置

![](https://pic.yqqy.top/blog/202208291335712.png)

8. 内存配置

![](https://pic.yqqy.top/blog/202208291336394.png)

9. 网络配置

![](https://pic.yqqy.top/blog/202208291058116.png)

10. 移除硬盘

![](https://pic.yqqy.top/blog/202208291348314.png)

11. 导入硬盘，在 `PVE` shell里输入命令 `qm importdisk 虚拟机id 镜像路径 local-lvm` 导入硬盘，返回虚拟机硬件配置，选择未使用的硬盘，格式为 `sata`

![](https://pic.yqqy.top/blog/202208291406163.png)

12. 调整引导顺序，注意只勾选sata，并将其上移到第一位

![](https://pic.yqqy.top/blog/202208291408236.png)

#### openwrt配置

待补充

### 点心云

博主的家宽上行只有30M，这种小水管为什么还要跑什么pcdn呢，现阶段属于是机器闲着也是闲着，况且机器负载太低了，硬盘又不缺，每天跑跑回本个电费+网费而已。

#### 安装

1. 下载镜像，[https://dianxinai.com/download](https://dianxinai.com/download) 
2. 下载iso的镜像就用装iKuai的方式装，img的镜像就用openwrt的方式装
3. 博主选择用img方式安装，与openwrt不同的是，在第5步系统安装里，要选择uefi方式引导（增加稳定性👻）

![](https://pic.yqqy.top/blog/202208291427925.png)

4. 磁盘这里选择好12G，大多数教程推荐16G，其实够用就行

![](https://pic.yqqy.top/blog/202208291429716.png)

5. 使用 `qm importdisk` 导入硬盘

![](https://pic.yqqy.top/blog/202208291451016.png)

6. 回到系统中，双击按sata方式添加

![](https://pic.yqqy.top/blog/202208291452321.png)

7. 修改引导顺序，选中刚添加的sata盘，并将其移到第一位

![](https://pic.yqqy.top/blog/202208291457541.png)

![](https://pic.yqqy.top/blog/202208291458321.png)

8. 进入控制台中进行装机，选择ok进行装机，这一步时间很长

![](https://pic.yqqy.top/blog/202208291459641.png)

9. 装机完成后会再次回到上图页面中，此时停止虚拟机，回到系统硬件设置中，将刚才添加的sata盘分离并删除

![](https://pic.yqqy.top/blog/202208291505278.png)

10. 添加数据盘，这里使用了直通硬盘，直通一块新的盘，如果本地盘足够大可以直接添加本地盘。使用命令 `ls -l /dev/disk/by-id/` 查看

![](https://pic.yqqy.top/blog/202208291507621.png)

使用命令 `qm set 虚拟机id -sata1 /dev/disk/by-id/ata-GLOWAY_STK960GS3-S7_002203065121` 可直通，请注意命令需要替换成自己的硬件信息

![](https://pic.yqqy.top/blog/202208291509685.png)

11. 开机启动，出现二维码，App添加应用

#### 配置网络

待补充

### ubuntu

1. ubuntu系统依托于PVE-LXC容器搭建，更轻，使用前先替换LXC容器源到国内，不然在线下载会很慢

```shell
# 查找相应文件
grep -rn "download.proxmox.com" /usr/share/perl5/PVE/*

# 替换容器源
sed -i.bak "s#http://download.proxmox.com/images#https://mirrors.ustc.edu.cn/proxmox/images#g" /usr/share/perl5/PVE/APLInfo.pm

# 写入容器源信息
wget -O /var/lib/pve-manager/apl-info/mirrors.ustc.edu.cn https://mirrors.ustc.edu.cn/proxmox/images/aplinfo.dat
```

2. 下载模板

![](https://pic.yqqy.top/blog/202208291522312.png)

3. 右上角<创建CT> ，取消勾选无特权的容器，其他步骤都很简单

4. LXC本身就是一个容器，如果想要在内部继续使用docker等容器技术，需要开启嵌套，并且需要在`PVE`里的shell编辑 `vim /etc/pve/lxc/容器id.conf` ，添加

![](https://pic.yqqy.top/blog/202208291525159.png)

```shell
# 添加如下内容
lxc.apparmor.profile: unconfined
lxc.cgroup.devices.allow: a
lxc.cap.drop:
```

## 实用的Docker服务

NPM(nginx-proxy-manager)

写的累了抽空补充