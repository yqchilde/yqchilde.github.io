---
title: "Golang编译应用通过Github Release实现检测覆盖更新"
description: ""
date: 2021-04-21 22:44:20
tags: ["Golang"]
---

# Golang编译应用通过Github Release实现检测覆盖更新

## Makefile
> 之前一直看到很多开源项目中都有Makefile的存在，博主也是第一次写Makefile，参考了很多文章，特此记录一下关于Golang交叉编译的Makefile



首先看一下完成的Makefile，长这个样子
```makefile
.PHONY:  clean build

# Binary name
BINARY=jd-cli

# Builds the project
build:
# 		@echo ${BINARY}; \
		@for project in $$(ls cmd); \
		do \
			go build -ldflags "-w -s -X main.Version=${VERSION}" "./cmd/$$project"; \
			upx "./$$project"; \
		done


release:
		# Clean
		go clean
		rm -rf *.gz

		# Build for mac
		@for project in $$(ls cmd); \
		do \
			GO111MODULE=on go build -ldflags "-w -s -X main.Version=${VERSION}" "./cmd/$$project"; \
			upx "./$$project"; \
			tar czvf $$project-darwin-amd64.tar.gz ./$$project; \
		done


		# Build for linux
		go clean
		@for project in $$(ls cmd); \
		do \
			CGO_ENABLED=0 GOOS=linux GOARCH=amd64 GO111MODULE=on go build -ldflags "-w -s -X main.Version=${VERSION}" "./cmd/$$project"; \
			upx "./$$project"; \
			tar czvf $$project-linux-amd64.tar.gz ./$$project; \
		done

		go clean

# Cleans our projects: deletes binaries
clean:
		@for project in $$(ls cmd); \
		do \
			rm -rf $$project; \
		done
		go clean
		rm -rf *.gz


```
### 逐行解释

- 第 1 行：`.PHONY` 是一个伪造的target，在Makefile中target默认是文件，即同目录下的文件，为了不使Makefile中的命令与之冲突，需要伪造一个target
- 第 4 行：理解为设置了一个变量，用于在全局中引用， **注意** 在Makefile中定义的变量， **引用** 时需要 `${}` 包住
- 第 7 行：每个命令后记得写冒号 `:` 
- 第 8-13行：这里是写了一个 `shell` 语法， **注意** 在Makefile中写shell需要有一些“特殊处理”。
   - 语句前面写 `@` 表示不将语句输出到Terminal
   - 每一行后要写 `;` 号 和 `\` 号，表示结束和换行
   - 对于不是在Makefile中定义的变量，引用时需要多加一层  `$`  ，即变成了 `$$` 
## 编译时动态指定版本号
> 在上面的Makefile中，有这样一行内容 `go build -ldflags "-w -s -X main.Version=${VERSION}" "./cmd/$$project"; \` ，下面解释一下

- `-ldflags "-w"` :去掉调试信息 
- `-ldflags "-s"` 去掉符号表

这两没啥可说的，大家都懂

- `-ldflags "-X main.Version=${VERSION}` ：这行的内容就属于动态注入变量，看个🌰



```go
package main

import (
	"flag"
	"fmt"
)

var Version string

func main() {
	v := flag.Bool("v", false, "version")
	flag.Parse()

	if *v {
		fmt.Println("当前版本: " + Version)
		return
	}

}

```
使用 `go build main.go`，运行结果为 `当前版本:`

再使用 `go build -ldflags "-X main.Version=1.0.0" main.go`，运行结果为 `当前版本: 1.0.0`。我们可以基于此功能写入到Makefile中，就是上面的Makefile

> 2023-01-05 10:30:55补充
> 
> 如果你想在子包中注入变量，请参考 [using-ldflags-to-set-version-information-for-go-applications](https://www.digitalocean.com/community/tutorials/using-ldflags-to-set-version-information-for-go-applications)

## 基于Github release进行覆盖更新

有了在编译时指定版本的方式，下一步尝试使用Github release来进行软件每次检查更新以及覆盖更新。
Github 开放了 [Github Api v3](https://docs.github.com/en/rest/reference/repos)，也有各种语言的SDK，就是判断版本号是否一致并进行下载解压覆盖重启即可。


主程序：
```go
package main

import (
	"bufio"
	"context"
	"flag"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"runtime"
	"strconv"
	"time"

	"github.com/cheggaaa/pb/v3"
	"github.com/google/go-github/v35/github"

	"TelegramBot/internal"
)

var (
	Version = ""
	Project = "jd-cli"
)

func main() {
	v := flag.Bool("v", false, "version")
	flag.Parse()

	if *v {
		fmt.Println("当前版本: " + Version)
		return
	}

	// 检查是否有更新
	ctx := context.Background()
	client := github.NewClient(nil)
	release, _, _ := client.Repositories.GetLatestRelease(ctx, "yqchilde", "scripts")

	if Version != release.GetTagName() {
		fmt.Println(release.GetBody())
		fmt.Print("发现新版本，是否要更新到", release.GetTagName(), " (y/n): ")
		input, err := bufio.NewReader(os.Stdin).ReadString('\n')
		if err != nil || (input != "y\n" && input != "n\n") || input == "n\n" {
			internal.ClearTerminal(runtime.GOOS)
		}

		if input == "y\n" {
			for _, asset := range release.Assets {
				sourceName := fmt.Sprintf("jd-cli-%s-%s.tar.gz", runtime.GOOS, runtime.GOARCH)
				if asset.GetName() == sourceName {
					ToUpdateProgram(asset.GetBrowserDownloadURL())
					return
				}
			}
		}
	}
}

func ToUpdateProgram(url string) {
	// 拿到压缩包文件名
	tarGzFileName := filepath.Base(url)

	client := http.DefaultClient
	client.Timeout = time.Second * 60 * 10
	resp, err := client.Get(url)
	if err != nil {
		log.Fatal(err)
	}

	if resp.StatusCode == http.StatusOK {
		log.Printf("[INFO] 正在更新: [%s]", Project)
		downFile, err := os.Create(tarGzFileName)
		internal.CheckIfError(err)
		defer downFile.Close()

		// 获取下载文件的大小
		contentLength, _ := strconv.Atoi(resp.Header.Get("Content-Length"))
		sourceSiz := int64(contentLength)
		source := resp.Body

		// 创建一个进度条
		bar := pb.Full.Start64(sourceSiz)
		bar.SetMaxWidth(100)
		barReader := bar.NewProxyReader(source)
		writer := io.MultiWriter(downFile)
		_, err = io.Copy(writer, barReader)
		bar.Finish()

		// 检查文件大小
		stat, _ := os.Stat(tarGzFileName)
		if stat.Size() != int64(contentLength) {
			log.Printf("[ERROR] [%s]更新失败", Project)
			err := os.Remove(tarGzFileName)
			internal.CheckIfError(err)
			return
		}

		log.Printf("[INFO] [%s]更新成功", Project)
		err = internal.TarGzDeCompress(tarGzFileName, "./")
		internal.CheckIfError(err)

		_ = os.Remove(tarGzFileName)
		_ = os.Chmod(Project, os.ModePerm)

		internal.ClearTerminal(runtime.GOOS)
		_ = internal.RestartProcess("./" + Project)
	} else {
		log.Printf("[ERROR] [%s]更新失败", Project)
		_ = os.Remove(tarGzFileName)
	}
}
```
internal包
```go
package internal

import (
	"archive/tar"
	"compress/gzip"
	"fmt"
	"io"
	"os"
	"os/exec"
	"strings"
	"syscall"
)

// CheckIfError ...
func CheckIfError(err error) {
	if err == nil {
		return
	}

	fmt.Printf("\x1b[31;1m%s\x1b[0m\n", fmt.Sprintf("error: %s", err))
	os.Exit(1)
}

// ClearTerminal 清空终端控制台
func ClearTerminal(goos string) {
	switch goos {
	case "darwin":
		cmd := exec.Command("clear")
		cmd.Stdout = os.Stdout
		_ = cmd.Run()
	case "linux":
		cmd := exec.Command("clear")
		cmd.Stdout = os.Stdout
		_ = cmd.Run()
	}
}

// TarGzDeCompress tar.gz解压函数
func TarGzDeCompress(tarFile, dest string) error {
	srcFile, err := os.Open(tarFile)
	if err != nil {
		return err
	}
	defer srcFile.Close()
	gr, err := gzip.NewReader(srcFile)
	if err != nil {
		return err
	}
	defer gr.Close()
	tr := tar.NewReader(gr)
	for {
		hdr, err := tr.Next()
		if err != nil {
			if err == io.EOF {
				break
			} else {
				return err
			}
		}
		filename := dest + hdr.Name

		err = os.MkdirAll(string([]rune(filename)[0:strings.LastIndex(filename, "/")]), 0755)
		if err != nil {
			return err
		}

		file, err := os.Create(filename)
		if err != nil {
			return err
		}
		io.Copy(file, tr)
	}
	return nil
}

// RestartProcess 重启进程
func RestartProcess(proName string) error {
	argv0, err := exec.LookPath(proName)
	if err != nil {
		return err
	}

	return syscall.Exec(argv0, os.Args, os.Environ())
}
```
效果如下：

![gif](./20210421224216.gif "效果图")

完整的项目代码在这里 [Golang基于Github releases进行覆盖更新](https://github.com/yqchilde/Scripts/blob/main/jd/cmd/jd-cli/main.go) 
## 参考文章

- [Golang Command Link](https://golang.org/cmd/link/) 
- [Go,Makefile与自动程序版本号的实现](https://xiaozhou.net/go-makefile-and-auto-version-2016-06-13.html) 
- [Github Api v3](https://docs.github.com/en/rest/reference/repos)
