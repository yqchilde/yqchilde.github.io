---
title: "使用GitHub Actions部署Hugo到阿里云"
description: "博客更换到了静态Hugo生成的网页，为了部署方便，所以使用GitHub Actions来自动化部署"
date: 2020-08-30 19:58:27
categories: ["奇技淫巧"]
tags: ["Github Actions"]
---

# 使用GitHub Actions部署Hugo到阿里云

## 了解

在使用 `GitHub Actions` 前先要了解什么是GitHub Actions

推荐看阮一峰老师的文章：[GitHub Actions入门教程](http://www.ruanyifeng.com/blog/2019/09/getting-started-with-github-actions.html)

## 熟悉流程

1. 首先我们在github创建自己的私有仓库，用来推Hugo生成的 `public` 文件夹
2. 利用 `GitHub Actions` 远程连接 `SSH`,执行删除服务器的绑定的web目录（即运行目录）
3. 利用 `GitHub Actions` SCP服务推送Github仓库下的 `public` 到远端服务器的web目录

## 创建Actions

前面我们已经提到先将Hugo生成的public文件夹整体推到了Github，接下来就是创建 `GitHub Actions`

![img](https://pic.yqqy.top/blog/1.png "创建Actions")

## 配置文件

连接SSH的选择一个Star比较多的，如下图

![img](https://pic.yqqy.top/blog/2.png "选择市场插件")

这边我贴一下我配置好的：

```yml
# This is a basic workflow to help you get started with Actions

name: CI

on:
  push:
    branches: [ master ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - name: Check Out
        uses: actions/checkout@v2
          
      # 使用SSH远程连接
      - name: SSH Remote Commands
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.ALIYUN_HOST }}
          username: ${{ secrets.ALIYUN_USER }}
          password: ${{ secrets.ALIYUN_PASSWORD }}
          script: bash /root/blog_del.sh
          
      # 用SCP将文件传到远端服务器
      - name: SCP Files to aliyun
        uses: appleboy/scp-action@master
        with:
          host: ${{ secrets.ALIYUN_HOST }}
          username: ${{ secrets.ALIYUN_USER }}
          password: ${{ secrets.ALIYUN_PASSWORD }}
          source: "./public"
          target: ${{ secrets.ALIYUN_PATH }}
```

::: tip 注意
* `secrets.xxx` 是官方设置秘钥的方法
* `secrets.ALIYUN_HOST` 服务器地址
* `secrets.ALIYUN_USER` 服务器用户名
* `secrets.ALIYUN_PASSWORD` 服务器密码
* `secrets.ALIYUN_PATH` 博客运行目录

第24行的运行脚本是指在连接到远端服务器时，先去删除服务器上原本的文件
:::

### 删除远端目录

![img](https://pic.yqqy.top/blog/20200830210144.png "删除远端目录")

```bash
if [ ! -d "远端目录" ];then
echo "文件夹不存在"
else
rm -rf 远端目录
fi
```

### secrets添加

![img](https://pic.yqqy.top/blog/20200830204924.png "secrets添加位置")

## 推送

点击右上角保存即可，这样每次只需要在本地将文章推到GitHub就可以自动部署到服务器了。

![img](https://pic.yqqy.top/blog/20200830205650.png "运行日志")

## 补充

> 2020/09/01 补充 Algolia搜索的自动同步

本站搜索用的是`Algolia`搜索，由于每次需要手动将Hugo生成的要搜索的json数据手动同步到 `Algolia`比较麻烦，所以研究了下继续使用 `GitHub Actions`，这样在上面一系列操作后面添加即可。

**引用库来自：** [https://github.com/chrisdmacrae/atomic-algolia](https://github.com/chrisdmacrae/atomic-algolia)

贴一下代码，在上面的 `yml配置文件中后面跟着添加`

```yml
- name: Use Node.js
  uses: actions/setup-node@v1
  with:
  node-version: '12.x'

- name: Install automic-algolia
  run: | 
  npm install atomic-algolia
  npm run algolia
  env:
  ALGOLIA_APP_ID: ${{ secrets.ALGOLIA_APP_ID }}
  ALGOLIA_ADMIN_KEY: ${{ secrets.ALGOLIA_ADMIN_KEY }}
  ALGOLIA_INDEX_NAME: ${{ secrets.ALGOLIA_INDEX_NAME }}
  ALGOLIA_INDEX_FILE: "./public/index.json"
```

::: tip 技巧
其中的 `ALGOLIA_ADMIN_KEY` 是ADMIN_KEY，而不是SEARCH_KEY

`ALGOLIA_INDEX_FILE` 这里写自己GitHub仓库中相对要上传的文件的地址 
:::

![img](https://pic.yqqy.top/blog/20200901074049.png "完美执行")

> 2020/09/016补充 放弃SCP，使用RSync

用了一段时间随着生成文件的越来越多，SCP是真的太慢了，在Github Actions 上我往往需要花费10多分钟才能完成部署。

用到的Rsync库是 [https://github.com/marketplace/actions/rsyncer-action](https://github.com/marketplace/actions/rsyncer-action)，配置的一些参数看给出的文档就可以。

这里贴出来我重新配置的yml：

::: tip 技巧
这次为了几乎很快的部署衔接，显示同步了文件，后来才去执行脚本删除，之前那种会因为先删除，而由于没有同步完成文件，网站处于无法访问的情况，当然那是出现在SCP中，经测试，Rsync还是很让我满意的
:::

```yaml
# This is a basic workflow to help you get started with Actions

name: CI

on:
  push:
    branches: [ master ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - name: Check Out
        uses: actions/checkout@v2
        
      - name: rsync deployments
        uses: Pendect/action-rsyncer@v1.1.0
        env:
          DEPLOY_KEY: ${{ secrets.ALIYUN_KEY }}
        with:
          flags: '-avzr --delete'
          src: 'public/'
          dest: '${{ secrets.ALIYUN_USER }}@${{ secrets.ALIYUN_HOST }}:${{ secrets.ALIYUN_PATH }}'
          
      - name: SSH Remote Commands
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.ALIYUN_HOST }}
          username: ${{ secrets.ALIYUN_USER }}
          password: ${{ secrets.ALIYUN_PASSWORD }}
          script: bash /root/blog_develop.sh
          
      - name: Use Node.js
        uses: actions/setup-node@v1
        with:
          node-version: '12.x'

      - name: Install automic-algolia
        run: | 
          npm install atomic-algolia
          npm run algolia
        env:
          ALGOLIA_APP_ID: ${{ secrets.ALGOLIA_APP_ID }}
          ALGOLIA_ADMIN_KEY: ${{ secrets.ALGOLIA_ADMIN_KEY }}
          ALGOLIA_INDEX_NAME: ${{ secrets.ALGOLIA_INDEX_NAME }}
          ALGOLIA_INDEX_FILE: "./public/index.json"

```

需要用到的 `blog_develop.sh`

```bash
# 删除项目目录
if [ ! -d "远端目录" ]; then
echo "原项目文件不存在"
else
rm -rf 远端目录
fi

if [ ! -d "新的临时文件目录，比如 远端目录temp" ]; then
echo "临时项目文件不存在"
else
# 重命名文件夹
mv 远端目录temp 远端目录
fi

echo "publish success!"
```

![img](https://pic.yqqy.top/blog/20200916082539.png "效果图")

## 结束

至此，每次只需要在本地写文章并推送到GitHub，其他的事情就交给GitHub Actions做就可以了