---
title: "Nginx常用配置"
description: "记录一些Nginx常用配置项及说明。"
date: 2021-11-09 17:31:11
categories: ["奇技淫巧"]
tags: ["Nginx"]
---

# Nginx常用配置

## Nginx配置参数

### 添加nginx用户

使用nginx这个用户运行，更加安全，默认nobody

```nginx
user nginx;
```

### 指定pid文件位置

```nginx
pid logs/nginx.pid;
```

### 指定日志输出位置

notice指日志级别

```nginx
error_log logs/nginx.log notice;
```

## 性能优化相关

### 开启的工作进程数量

number通常应该为当前主机的cpu的屋里核心数

auto表示和CPU内核相关，有几个内核，就会开启几个线程

Linux系统可通过命令lscpu查看cpu核数，假如为4，则：`worker_processes: 4`

```nginx
worker_process number|auto;
```

### 工作进程绑定指定CPU

工作进程绑定指定CPU，或单个工作进程绑定到多个CPU，通常不用配置

CPU MASK: 00000001 -> 0号CPU

```nginx
worker_cpu_affinity cpumask;
worker_cpu_affinity auto cpumask; # 提高缓存命中率

# example
worker_cpu_affinity 0001 0010 0100 1000;
worker_cpu_affinity auto 0101 1010;
```

### 定义工作进程的调度优先级

与使用`nice` 命令完成类似，负数意味着更高的优先级。允许范围为[-20,20]

```nginx
worker_priority number;
```

### 一个nginx进程打开的最多文件描述符数目

这个指令是指当一个nginx进程打开的最多文件描述符数目，理论值应该是最多打开文件数（ulimit -n）一样。现在在linux2.6内核下开启文件打开数为65535，最好根据测试数据来限定，超过承受能力会导致其他访问很卡，但若限定后，其他访问正常，多出的会禁止访问。

```nginx
worker_rlimit_nofile 65535;
```

### 每个word进程可以建立的最大的链接数

设置工作进程可以打开的同时连接的最大数量

应该记住的是，这个数字包括了所有连接（例如与代理服务器的连接等），而不仅仅是客户端的连接。另一个要考虑因素是实际的并发连接数不能超过最大打开文件数的限制，可以通过 `worker_rlimit_nofile`来修改

```nginx
worker_connections 65535;
```

`worker_commections` 计算方式按照如下参考：

```nginx
并发限定总数（max_clients） = worker_processes * worker_connections

# 设置了反向代理后，每个并发会建立与客户端的连接和后端服务的连接，会占用两个连接
并发限定总数（max_clients） = worker_processes * worker_connections / 2
```

## IO

事件模型与worker进程连接数设置

```nginx
events {
  # epoll模型是Linux2.6以上版本内核中的高性能网络I/O模型，如果泡在FreeBSD上面，就用kqueue模型
  use epoll;
}
```

## Http

```nginx
http {
  # ================================= 日志格式 =================================
  log_format main '$remote_addr - $remote_user [$time_local] "$request"'
                  '$status $body_bytes_sent "$http_referer" "$request_time"'
                  '"$http_user_agent" "$http_x_forwarded_for" "$request_time" "$content_type"'
                  '"$request_body"'

  # 日志位置
  access_log /var/log/nginx/access.log main;
  error_log /var/log/nginx/error.log info;

  # 定义日志缓存
  # max: 设置缓存中的最大描述符数，如果缓存变满，则最近最少使用（LRU）的描述符将被关闭
  # inactive: 如果在此期间没有发生访问，则设置关闭缓存描述符的时间。默认为 10 秒
  # min_uses: 设置在 inactive 参数定义的时间内文件使用的最小数量，使描述符在缓存中保持打开状态。默认为1
  # valid: 设置检查同名文件是否仍然存在的时间。默认为 60 秒
  # off: 禁用缓存
  open_log_file_cache off;
  open_log_file_cache max=1000 inactive=20s min_uses=2 valid=1m;
  
  # 由 ngx_http_rewrite_module 模块提供的，用来记录重写日志的，对于调试重写规则建议开启。
  rewrite_log on;
  # =========================================================================
  
  # ================================= Limit =================================
  # 为指定的共享内存区域设置参数，该区域将保留各种 key 的状态。尤其是状态包括当前的连接数。key 可以包含文本、变量及其组合（1.11.2）。不计算 key 为空的连接。
  # key 是一个 $binary_remote_addr 变量设置的客户端 IP 地址。$binary_remote_addr 的大小为 IPv4 地址的 4 个字节或 IPv6 地址的 16 个字节。存储状态在 32 位平台上总是占用 32 或 64 字节，在 64 位平台上占用 64 字节。一兆字节区域可以保留大约 32,000 个 32 字节状态或大约 16,000 个 64 字节状态。如果区域存储耗尽，服务器将关闭连接。
  limit_conn_zone $binary_remote_addr zone=addr:5m;

  # 设置每一个IP地址最大同时打开的连接数
  limit_conn addr 50;

  # 限速模块，指定向客户端传输数据的速度，单位是（字节数/秒）
  # 注意：该限制只是针对一个连接的设定，也就是说，如果同时有两个连接，他的速度将会是指令设置的两倍
  limit_rate 512k;

  # 限速模块，前3M下载时不限速
  limit_rate_after 3m;
  # =========================================================================

  # ================================= 基础配置 =================================
  # SSI是英文Server Side Includes的缩写，翻译成中文就是服务器端包含的意思。
  # 从技术角度上说，SSI就是在HTML文件中，可以通过注释行调用的命令或指针。
  # SSI具有 强大的功能，只要使用一条简单的SSI命令就可以实现整个网站的内容更新，时间和日期的动态显示，以及执行shell和CGI脚本程序等复杂的功能。
  ssi off;

  # 启用或禁用目录列表输出
  autoindex off;

  # 默认文件类型，默认text/plain
  default_type application/octet-stream;

  # 隐藏版本号
  server_tokens off;

  # 编码格式
  charset UTF-8;
  # =========================================================================
  
  # ================================= 信息传输 =================================
  # 开启高效文件传输模式，sendfile指令指向nginx是否调用sendfile函数来输出文件，对于普通应用设为on，如果用来进行下载等应用磁盘I/O重负载应用，可设为off，以平衡磁盘和网络I/O处理速度，降低系统的负载。如果图片显示不正确把这个改为off。
  sendfile on;

  # 必须在sendfile开启时才有效，告诉nginx在一个数据包里发送所有头文件，而不是一个接一个的发送。
  tcp_nopush on;

  # 必须在sendfile开启时才有效，告诉nginx不要缓存数据，而是一段一段的发送，当需要及时发送数据时，就应该给应用设置这个属性，这样发送一小块数据时就不能立即得到返回值。
  tcp_nodelay on;
  # =========================================================================

  # ================================= 超时设置 =================================
  # 设置超时时间，在此期间与 upstream 服务器的空闲 keepalive 连接将保持打开状态
  keepalive_timeout 30;

  # 设置请求头的超时时间，我们也可以把这个设置低些，超过这个时间没有发送任何数据，nginx将返回request timeout的错误
  client_header_timeout 10;

  # 定义读取客户端请求头的超时时间。如果客户端在这段时间内没有传输整个报头，则将 408（请求超时）错误返回给客户端
  client_body_timeout 10;

  # 设置向客户端发送响应的超时时间。超时设置只限定在两次连续的写入操作之间，而不是用于整个响应的传输。如果客户端在此时间内没有收到任何内容，则连接将被关闭
  send_timeout 10;

  # 告诉nginx关闭不响应的客户端连接，这将会释放该客户端所占有的内存空间
  reset_timedout_connection on;
  # =========================================================================
  
  # ================================= server_name =================================
  # 保存服务器名字（server_name www.xx.com这种）的hash表，如果名字太长，就需要将如下值变大为64
  server_names_hash_bucket_size 64;

  # 存储服务器名字的大小，默认512kb，如果一个server对应多个域名，就要加大此值
  server_names_hash_max_size 512;
  # =========================================================================
  
  # ================================= 提交缓存 =================================
  # nginx 会将整个请求头都放在一个 buffer 里面，这个buffer 的大小通过配置项 client_header_buffer_size 来设置，如果用户的请求头太大，这个 buffer 装不下，那 nginx 就会重新分配一个新的更大的 buffer来装请求头，这个大 buffer 可以通过 large_client_header_buffers 来设置，这个 large_buffer 这一组 buffer，比如配置 4 8k，就是表示有四个 8k 大小的buffer 可以用。
  client_header_buffer_size 32k;

  # 此指令规定了用于读取大型客户端请求头的缓冲区的最大数量和大小。 这些缓冲区仅在缺省缓冲区不足时按需分配。 当处理请求或连接转换到保持活动状态时，释放缓冲区。如下例子：
  large_client_header_buffers 4 32k;

  # 此指令设置NGINX能处理的最大请求主体大小。 如果请求大于指定的大小，则NGINX发回HTTP 413（Request Entity too large）错误。如果在上传大文件，可以将此值设置大一些
  client_max_body_size 8m;

  # 这个将为打开文件指定缓存，默认是没有启用的，max指定缓存数量，建议和打开文件数一致，inactive 是指经过多长时间文件没被请求后删除缓存。
  open_file_cache max=100000 inactive=20s;

  # 这个是指多长时间检查一次缓存的有效信息。
  open_file_cache_valid 30s;

  # open_file_cache指令中的inactive 参数时间内文件的最少使用次数，如果超过这个数字，文件描述符一直是在缓存中打开的，如上例，如果有一个文件在inactive 时间内一次没被使用，它将被移除。
  open_file_cache_min_uses 2;

  # 指定了当搜索一个文件时是否缓存错误信息，也包括再次给配置中添加文件。我们也包括了服务器模块，这些是在不同文件中定义的。如果你的服务器模块不在这些位置，你就得修改这一行来指定正确的位置
  open_file_cache_errors off;
  # =========================================================================

  # ================================= 压缩方面 =================================
  # 开启页面压缩
  gzip on;

  # gzip压缩是要申请临时内存空间的，假设前提是压缩后大小是小于等于压缩前的。例如，如果原始文件大小为10K，那么它超过了8K，所以分配的内存是8 * 2 = 16K;再例如，原始文件大小为18K，很明显16K也是不够的，那么按照 8 * 2 * 2 = 32K的大小申请内存。如果没有设置，默认值是申请跟原始数据相同大小的内存空间去存储gzip压缩结果。
  gzip_buffers 2 8k;

  # 进行压缩的原始文件的最小大小值，也就是说如果原始文件小于1K，那么就不会进行压缩了
  gzip_min_length 1K;

  # 默认值: gzip_http_version 1.1(就是说对HTTP/1.1协议的请求才会进行gzip压缩)项
  # 识别http的协议版本。由于早期的一些浏览器或者http客户端，可能不支持gzip自解压，用户就会看到乱码，所以做一些判断还是有必要的。 
	# 注：99.99%的浏览器基本上都支持gzip解压了，所以可以不用设这个值,保持系统默认即可。
  # 假设我们使用的是默认值1.1，如果我们使用了proxy_pass进行反向代理，那么nginx和后端的upstream server之间是用HTTP/1.0协议通信的，如果我们使用nginx通过反向代理做Cache Server，而且前端的nginx没有开启gzip，同时，我们后端的nginx上没有设置gzip_http_version为1.0，那么Cache的url将不会进行gzip压缩
  gzip_http_version 1.1;

  # gzip压缩比/压缩级别，压缩级别 1-9，级别越高压缩率越大，当然压缩时间也就越长（传输快但比较消耗cpu）。
  # 默认值：1(建议选择为4)
  gzip_comp_level 5;

  # 需要进行gzip压缩的Content-Type的Header的类型。建议js、text、css、xml、json都要进行压缩；图片就没必要了，gif、jpge文件已经压缩得很好了，就算再压，效果也不好，而且还耗费cpu。
  gzip_types text/HTML text/plain application/x-javascript text/css application/xml;

  # 禁用IE6的gzip压缩，又是因为杯具的IE6。当然，IE6目前依然广泛的存在，所以这里你也可以设置为“MSIE [1-5].”
  # IE6的某些版本对gzip的压缩支持很不好，会造成页面的假死，今天产品的同学就测试出了这个问题后来调试后，发现是对img进行gzip后造成IE6的假死，把对img的gzip压缩去掉后就正常了为了确保其它的IE6版本不出问题，所以建议加上gzip_disable的设置
  gzip_disable "msie6";

  # Nginx作为反向代理的时候启用，开启或者关闭后端服务器返回的结果，匹配的前提是后端服务器必须要返回包含"Via"的 header头。
  # off: 关闭所有的代理结果数据的压缩
  # expired: 启用压缩，如果header头中包含 "Expires" 头信息
  # no-cache: 启用压缩，如果header头中包含 "Cache-Control:no-cache" 头信息
  # no-store: 启用压缩，如果header头中包含 "Cache-Control:no-store" 头信息
  # private: 启用压缩，如果header头中包含 "Cache-Control:private" 头信息
  # no_last_modified: 启用压缩,如果header头中不包含 "Last-Modified" 头信息
  # no_etag: 启用压缩，如果header头中不包含 "ETag" 头信息
  # auth: 启用压缩，如果header头中包含 "Authorization" 头信息
  # any: 无条件启用压缩
  gzip_proxied any;
  # 尽量发送压缩过的静态文件
  gzip_static on;

  server {
      # 监听地址 IPV4
      listen 80;
      # 监听地址 IPV6
      listen [::]:80;
      
      # 设置编码
      charset utf-8;
      # 设置server_name
      server_name localhost;

      # 根路由
      location / {
          root /usr/share/nginx/html;
          index index.html index.htm;
      }

      # ...
    
    	# 去掉后缀 / 的写法
      location /docs {
          alias /usr/share/nginx/html/docs/;
          index index.html;
          if (-d $request_filename) {
              rewrite [^/]$ $scheme://$http_host$uri/ permanent;
          }
      }
    
      # 反向代理写法
      location /api/ {
          proxy_http_version 1.1;
          proxy_pass http://192.168.0.102:8888/;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          proxy_set_header X-Forwarded-Proto $scheme;
          proxy_set_header X-NginX-Proxy true;
      
          # 添加跨域配置项
          add_header Access-Control-Allow-Origin *;
          add_header Access-Control-Allow-Methods 'POST,GET,OPTIONS,DELETE,PUT';
          add_header Access-Control-Allow-Headers 'Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';
      }

       error_page 404 = /index.html;

       error_log /var/log/nginx/error.log;
       access_log /var/log/nginx/access.log;
}
```

## 参考文章

* [Nginx 中文文档](https://docshome.gitbook.io/nginx-docs/)

* [nginx 并发数问题思考：worker_connections,worker_processes与 max clients](https://blog.51cto.com/liuqunying/1420556)

