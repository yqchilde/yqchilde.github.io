---
title: "正确配置rocket-nginx，加速你的wordpress"
description: "正确配置rocket-nginx，加速你的wordpress，前提是需要先获得`wp-rocket`插件，该插件是收费插件，如果有能力请支持正版，这里不提供下载地址，擅于利用搜索引擎或万能的某宝。本文是基于自己用宝塔配置rocket-nginx的教程，因为网上目前搜到的所有配置都是直接翻译github的README.md( 😒 )，不过还是推荐看最新的文档，没准啥时候就变动了，操作步骤如下"
date: 2020-03-08 11:15:56
tags: ["Wordpress"]
---

# 正确配置rocket-nginx，加速你的wordpress

## 0x01 前提

::: tip 前提
前提是需要先获得`wp-rocket`插件，该插件是收费插件，如果有能力请支持正版，这里不提供下载地址，擅于利用搜索引擎或万能的某宝。本文是基于自己用宝塔配置rocket-nginx的教程，因为网上目前搜到的所有配置都是直接翻译github的README.md(😒 )，不过还是推荐看最新的文档，没准啥时候就变动了
:::

## 0x02 正文

### rocket-nginx

- 介绍一下（翻译过来）：

Rocket-Nginx是WordPress缓存插件WP-Rocket的Nginx配置。它使Nginx可以直接提供以前缓存的文件，而无需调用WordPress或任何PHP。它还会添加标题以缓存CSS，JS和媒体，以通过减少对Web服务器的请求来利用浏览器的缓存。

- 简单说就是**NGINX→PHP-FPM→PHP→静态文件** 变成了 **NGINX→静态文件**（通过直接提供静态页面而不加载WordPress或PHP，可以使WP-Rocket更快。）

- github地址：[rocket-nginx](https://github.com/SatelliteWP/rocket-nginx)

### 禁止WP定时任务

在`wp-config`这个文件里添加一行代码，作用是为了禁止WP自带的CRON定时任务

`define('DISABLE_WP_CRON', true);`

### 添加新的定时任务

以下三种定时任务代码任一个就行，记得将website换成自己的网址

```shell
*/15 * * * * wget -q -O - http://www.website.com/wp-cron.php?doing_wp_cron &>/dev/null

or

*/15 * * * * curl http://www.website.com/wp-cron.php?doing_wp_cron &>/dev/null

or

*/15 * * * * cd /home/user/public_html; php wp-cron.php &>/dev/null
```

- 在SSH添加定时任务，先去了解`Crontab`知识，[点这里查看](https://www.runoob.com/w3cnote/linux-crontab-tasks.html)

- 有宝塔面板的可以直接在宝塔中添加定时任务，那就简单了

![image-20200308183831086](https://pic.yqqy.top/blog/20200308183833.png "定时任务")

### 拉取rocket-nginx到nginx目录

- 在SSH里面进入到nginx的目录，以宝塔为例（/www/server/nginx）`cd /www/server/nginx`

- 拉取代码 `git clone https://github.com/satellitewp/rocket-nginx.git`

- 从2.0版开始，必须生成配置。要生成默认配置，必须重命名禁用的ini文件并运行配置解析器：

  ```shell
  cd rocket-nginx
  cp rocket-nginx.ini.disabled rocket-nginx.ini
  php rocket-parser.php
  ```

- 运行之后就会在`rocket-nginx`目录生成一个`default.conf`文件，是根据`rocket-nginx.ini`对应解析的，所以可以看看相应配置

### 在nginx配置文档导入

- 在对应网站的`nginx`配置文档中`server`部分导入

  ```nginx
  server {
      ...
      # Rocket-Nginx configuration
  	include /www/server/nginx/rocket-nginx/default.conf;
      ...
  }
  ```

- 配置完要先测试是否配置可行 `nginx -t`
- 配置可行记得重启nginx `service nginx reload`

### 测试是否生效

- 在`rocket-nginx.ini` 文件中将`debug`设置成true，这样就可以看到在请求的header里面有`X-Rocket-Nginx`开头的内容

  ```http
  X-Rocket-Nginx-Serving-Static：配置是否直接提供了缓存文件（是否绕过WordPress）：是或否
  X-Rocket-Nginx-Reason：注明了为什么启用的原因，如果启用成功返回路径，失败返回原因
  X-Rocket-Nginx-File：不管是否启用成功，这里展示一下代理的路径，方便拍错
  ```

## 0x03 注意

- 提示：每次更改了`rocket-nginx.ini`就要利用`php rocket-parser.php` 命令解析

- 记得关闭`wp-rocket`插件中的对移动端单独缓存功能，（除非你的主题开发了两端）我想现在的主题都是响应式的不存在这个问题

- 如果站点是`https`并且在header中显示如下内容，即结尾一直是`/index.html`，那就说明可能是你的nginx配置文件的问题，需要从自己的文档下手

  ```http
  X-Rocket-Nginx-Serving-Static：NO
  X-Rocket-Nginx-File：... /index.html
  ```

- 正确的路径结尾应该是 `index-https.html_gzip`，这是`https`站点的情况

## 0x04 效果

在没有做`nginx`优化时，即使用了`wp-rocket`插件也是两个B，现在明显有变化，因为本主题是图文式的，如果你的主题不怎么用图片，那么效果会更为显著。

![image-20200308190851632](https://pic.yqqy.top/blog/20200308190854.png "速度测试")