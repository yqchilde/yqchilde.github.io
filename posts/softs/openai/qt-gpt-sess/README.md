---
sort: 1
title: "GPT批量提sess和测活"
description: "GPT SessionID提取刷新和账号测活软件"
date: 2024-07-16 23:40:07
tags: ["OpenAI"]
---

# GPT SessionID提取刷新和账号测活软件

::: tip 软件介绍
* 软件类型：**付费（需授权）**
* 软件作用：👨‍💻帮你快速获取或刷新sess，refresh_token，以及账号测活
* **用前必看**：[📌 软件自述文件](./soft-used-readme)
:::

## 1. 使用视频

<ClientOnly><ArtPlayer url='https://artplayer.org/assets/sample/video.mp4'/></ClientOnly>

## 2. 版本日志

:::details 版本更新日志
v1.1.1 (2024-07-16)
1. 更新界面布局
2. 修复列表状态栏状态显示 
3. 优化代理检测OpenSSL Routing错误 
---
v1.1.0 (2024-07-15)
1. 优化错误重试逻辑
2. 优化打码平台一些重要错误无法停止线程
3. 更新登录逻辑以及更新指纹信息
4. 新增Arkose打码配置，增加打码网关(XyHelper-Agent)
5. 修改账号表格中右键导入可导入三种格式
    * (1) 账号----密码----邮密 (该方式走打码，会获取session_id和refresh_token)
    * (2) 账号----密码----邮密----session_id (该方式不会走打码，只检查session是否有效)
    * (3) 账号----密码----邮密----refresh_token (该方式不会走打码，直接刷新session)
---
v1.0.3
1. 修改代理方式为账号密码验证
2. 优化openai请求异常
3. 增加自定义UserAgent
4. 增加错误重试（就是遇到自定义的错误会进行任务重试，需要在其他设置里配置）        
---
v1.0.2
1. 导入格式变成: 
    账号----密码----邮密
    账号----密码----邮密----sess
2. 优化线程失败重试

v1.0.1
1. 增加拖拽文本文件导入账号功能
2. 增加输出结果分类功能
:::
