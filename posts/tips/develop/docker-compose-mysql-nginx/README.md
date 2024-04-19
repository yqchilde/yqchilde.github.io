---
title: "Docker Compose简单配置Mysql Nginx挂载持久化"
description: "通过docker-compose简单的配置一下mysql和nginx，并且挂载到一个文件夹。"
date: 2021-02-11 17:05:43
categories: ["奇技淫巧"]
tags: ["Docker", "MySQL", "Nginx", "Redis"]
---

# Docker Compose简单配置Mysql Nginx挂载持久化

:::info 
记录片段：用 docker-compose 简单 mysql 与 nginx 两个容器，并挂载 volumes
:::

## docker-compose.yml

```yaml
version: "3"
services:
  mysql:
    image: mysql:5.7
    container_name: mysql
    restart: always
    environment:
      - MYSQL_ROOT_PASSWORD=***
    volumes:
      - ~/mysql/datas:/var/lib/mysql
      - ~/mysql/conf/my.cnf:/etc/my.cnf
    ports:
      - "3306:3306"
  nginx:
    image: nginx:latest
    restart: always
    volumes:
      - ~/nginx/logs:/var/log/nginx
      - ~/nginx/conf/nginx.conf:/etc/nginx/nginx.conf
      - ~/nginx/www:/usr/share/nginx/html
    ports:
      - "80:80"
```

## 分析

### MySQL

创建``datas` 和 `conf` 两个空目录，编写`my.cnf`文件放入`conf`文件夹，配置如下：

```ini
[mysqld]
user=mysql
default-storage-engine=INNODB
character-set-client-handshake=FALSE
character-set-server=utf8mb4
collation-server=utf8mb4_unicode_ci
init_connect='SET NAMES utf8mb4'
[client]
default-character-set=utf8mb4
[mysql]
default-character-set=utf8mb4
```

### Nginx

创建`logs`、`conf`、`www`三个空目录，编写`nginx.conf`文件放入`conf`文件夹。

## Nginx 多目录

当我们只有一个端口可以开`Server`时，就需要一个`Server`开启多个`location`来写规则，具体需求就是在`www`目录下有`home`和`docs`两个目录，通过不同的后缀去访问不同的页面，规则这样写：

```nginx
Server {
  listen 80;
  listen [::]:80;

  charset     utf-8;
  server_name location;

  location / {
    root /usr/share/nginx/html;
    index index.html;
  }

  location /docs {
    alias /usr/share/nginx/html/docs/;
    index index.html;
  }
}
```

需要注意的是`root`和`alias`的区别，一个是从`root`下跟`location`路径，一个是通过`location`路径的别名到`alias`的路径。

这时候，又发现了一个问题，那就是如果不加`/`，就会出现端口丢失问题，因为容器内映射的端口是 80 端口，外边公网给的 ip 是另一个，而 80 是浏览器 web 页面的默认端口，举个 🌰，`47.1.2.1:8090/docs`没有加`/`就会经过 nginx 的 301 重定向到`47.1.2.1/docs/`，由于端口丢失，即使重定向到带有`/`的地址也只是 404，这时只需要修改为如下配置即可。

```nginx
location /docs {
    alias /usr/share/nginx/html/docs/;
    index index.html;
    if (-d $request_filename) {
      rewrite [^/]$ $scheme://$http_host$uri/ permanent;
    }
  }
```

## Redis

> 2021-04-22补充redis的配置

```yaml
version: "3"
services:
  redis:
    image: redis:alpine
    container_name: redis
    restart: always
    volumes:
      - ../redis/data:/data
      - ../redis/conf/redis.conf:/usr/local/etc/redis/redis.conf
      - ../redis/logs:/logs
    command: redis-server /usr/local/etc/redis/redis.conf
    ports:
      - "6379:6379"
```