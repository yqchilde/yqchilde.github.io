---
title: "在算能盒子 (BMNN) 上使用gocv"
description: "本文记录了在算能盒子 (BMNN) 上使用gocv的过程，本文将描述使用期间走过的坑，以及如何解决这些坑。"
date: 2022-04-19 17:29:34
tags: ["Golang"]
---

# 在算能盒子 (BMNN) 上使用gocv

::: tip 背景
本文的背景是基于一台 **AI微服务器SE5-8** （以下简称AI盒子）上进行开发，SOPHON AI微服务器SE5-8是一款高性能、低功耗边缘计算产品，搭载算能自主研发的第三代TPU芯片BM1684，INT8算力高达10.6TOPS，可同时处理8路高清视频，支持8路全高清视频硬件解码与1路编码。
:::

## 初遇 - Golang 编译

首先我们准备如下一段代码：

```go
package main

import (
	"fmt"

	_ "gocv.io/x/gocv"
)

func main() {
	fmt.Println("Hello, World!")
}
```

我们根据 `gocv.io` 的文档，先要确保安装了 `opencv`，在这台 AI盒子 上已经存在了一个 `opencv` 的编译包，其目录在 `/system/lib` 目录下。我们先进行一下 `go build`，结果如下：

```shell
$ go build

# pkg-config --cflags  -- opencv4
Package opencv4 was not found in the pkg-config search path.
Perhaps you should add the directory containing `opencv4.pc'
to the PKG_CONFIG_PATH environment variable
No package 'opencv4' found
pkg-config: exit status 1
```

## 浅尝 - 尝试使用自带的opencv

根据上文报错信息看，是因为我们没有按照 `gocv` 指定的依赖路径存放opencv编译包，所以我们需要指定一个路径，做如下处理：

1. 创建opencv4.pc文件

```shell
$ vim /system/lib/pkgconfig/opencv4.pc
```

2. 在文件中添加如下内容：

```shell
# Package Information for pkg-config

prefix=/system
exec_prefix=${prefix}
libdir=${exec_prefix}/lib
includedir=${prefix}/include/opencv/opencv4

Name: OpenCV
Description: Open Source Computer Vision Library
Version: 4.1
Libs: -L${exec_prefix}/lib -lopencv_gapi -lopencv_stitching -lopencv_alphamat -lopencv_aruco -lopencv_barcode -lopencv_bgsegm -lopencv_bioinspired -lopencv_ccalib -lopencv_dnn_objdetect -lopencv_dnn_superres -lopencv_dpm -lopencv_face -lopencv_freetype -lopencv_fuzzy -lopencv_hfs -lopencv_img_hash -lopencv_intensity_transform -lopencv_line_descriptor -lopencv_mcc -lopencv_quality -lopencv_rapid -lopencv_reg -lopencv_rgbd -lopencv_saliency -lopencv_stereo -lopencv_structured_light -lopencv_phase_unwrapping -lopencv_superres -lopencv_optflow -lopencv_surface_matching -lopencv_tracking -lopencv_highgui -lopencv_datasets -lopencv_text -lopencv_plot -lopencv_videostab -lopencv_videoio -lopencv_wechat_qrcode -lopencv_xfeatures2d -lopencv_shape -lopencv_ml -lopencv_ximgproc -lopencv_video -lopencv_dnn -lopencv_xobjdetect -lopencv_objdetect -lopencv_calib3d -lopencv_imgcodecs -lopencv_features2d -lopencv_flann -lopencv_xphoto -lopencv_photo -lopencv_imgproc -lopencv_core
Libs.private: -ldl -lm -lpthread -lrt
Cflags: -I${includedir}
```

3. 设置环境变量指定 `opencv4.pc` 的路径，不指定时默认找的是 `/usr/local/lib/pkgconfig/opencv4.pc`

```shell
$ export PKG_CONFIG_PATH="/system/lib/pkgconfig"
```

4. 再次进行编译

```shell
$ go build

# gocv.io/x/gocv
highgui.cpp: In function ‘void Window_New(const char*, int)’:
highgui.cpp:5:5: error: ‘namedWindow’ is not a member of ‘cv’
     cv::namedWindow(winname, flags);
     ^~
highgui.cpp: In function ‘void Window_Close(const char*)’:
highgui.cpp:9:5: error: ‘destroyWindow’ is not a member of ‘cv’
     cv::destroyWindow(winname);
     ^~
highgui.cpp: In function ‘void Window_IMShow(const char*, Mat)’:
highgui.cpp:13:5: error: ‘imshow’ is not a member of ‘cv’
     cv::imshow(winname, *mat);
     ^~

... 省略很多错误
```

发现编译还是报了很多错误，出现这个原因是因为我所使用的这台 AI盒子 ，不支持显示即可视化，那么就意味着用不来了自带的优化好的 opencv 了，而且这里要说，自带的 opencv 是4.1的，如果要使用 `gocv` 最近的几个版本，其中很多方法，可能在编译好的opencv库里并没有，这就意味着我们要想办法自行编译 `opencv`。

## 所悟 - 自行编译opencv

1. 进入gocv mod中的文件夹

```shell
$ cd $GOPATH/pkg/mod/gocv.io/x/gocv\@v0.30.0/
$ sudo chmod u+x Makefile
$ sudo make install
```

2. 鉴于 AI盒子 性能考虑，可以**不选用**方式1，而是在官方提供的 **docker镜像** 内完成编译

下载指定版本 [opencv](https://github.com/opencv/opencv/archive/4.5.3.zip) , [opencv_contrib](https://github.com/opencv/opencv_contrib/archive/4.5.3.zip) 源码解压，这俩放在同一目录，进入 `opencv-x.x.x/platforms/linux` 目录下修改文件 `aarch64-gnu.toolchain.cmake`，内容如下：

```shell
set(CMAKE_SYSTEM_PROCESSOR aarch64)
set(GCC_COMPILER_VERSION "" CACHE STRING "GCC Compiler version")
set(GNU_MACHINE "aarch64-linux-gnu" CACHE STRING "GNU compiler triple")
set(CMAKE_C_COMPILER /data/release/toolchains/gcc/gcc-linaro-6.3.1-2017.05-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu-gcc )
set(CMAKE_CXX_COMPILER /data/release/toolchains/gcc/gcc-linaro-6.3.1-2017.05-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu-g++ )
set(ARM_LINUX_SYSROOT /data/release/toolchains/gcc/gcc-linaro-6.3.1-2017.05-x86_64_aarch64-linux-gnu/ CACHE PATH "ARM cross compile system root")

include("${CMAKE_CURRENT_LIST_DIR}/arm.toolchain.cmake")
```

在 `opencv-x.x.x/platforms/linux` 目录下执行 `mkdir build && cd build && mkdir opencv_install`，执行 `cmake` 生成 `Makefile` 

```shell
cmake -DCMAKE_INSTALL_PREFIX=./opencv_install/ -DCMAKE_TOOLCHAIN_FILE=../aarch64-gnu.toolchain.cmake \
      -DOPENCV_EXTRA_MODULES_PATH=/root/opencv/opencv_contrib-4.5.3/modules -DBUILD_opencv_videoio=OFF -DBUILD_opencv_highgui=OFF  ../../..
```

执行 `make -j $(nproc --all)` 进行编译，执行 `make install` 安装编译后文件到 `opencv_install` 目录，拷贝 `lib` 和 `include` 目录内文件到盒子相关目录

## 终章 - 再次使用Golang编译

1. 删除和gui相关的文件

```shell
$ cd $GOPATH/pkg/mod/gocv.io/x/gocv\@v0.30.0/

$ sudo rm -rf highgui* videoio* photo*
```

2. 改变 `opencv4.pc` 的路径，不指定时默认找的是 `/usr/local/lib/pkgconfig/opencv4.pc`，由于上面切到了 `/system/lib/pkgconfig` 里，这里再切回来

```shell
$ export PKG_CONFIG_PATH="/usr/local/lib/pkgconfig"
```

3. 修改 `opencv4.pc` 的内容，其中第 11 行后面指定的是需要依赖的so库，内容如下：
```shell
# Package Information for pkg-config

prefix=/usr/local
exec_prefix=${prefix}
libdir=${exec_prefix}/lib
includedir=${prefix}/include/opencv4

Name: OpenCV
Description: Open Source Computer Vision Library
Version: 4.5.3
Libs: -L${exec_prefix}/lib -lopencv_core -lopencv_imgcodecs -lopencv_objdetect -lopencv_features2d -lopencv_video -lopencv_dnn -lopencv_imgproc -lopencv_xfeatures2d -lopencv_calib3d
Libs.private: -ldl -lm -lpthread -lrt
Cflags: -I${includedir}
```

4. 再次 `go build` 发现成功编译

```shell
$ go build

Hello, World!
```

## 总结 - 撒花

1. 如果没有按照 `gocv` 指定的 `opencv` 编译方式去编译，那需要自己指定 `opencv4.pc` 的位置
2. 如果编译过程中报了某些依赖库( .so 库)的错，要么去想办法解决掉那些库，编译过程中实在用不到的，要在 `gocv` 源码中删掉对应的文件
3. `gocv` 当前对 `opencv` 的实现有些许不全， 但是两边得对上， `gocv` 里面 `cpp` 有的 `opencvlib` 也得有，`opencvlib` 没有的 删了 `gocv` 里面的相关 `cpp文件` 就行了
