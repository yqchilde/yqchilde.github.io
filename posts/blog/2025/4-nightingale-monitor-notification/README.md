---
title: 夜莺v8执行自定义脚本并告警通知
description: 利用夜莺v8执行自定义脚本，进行对业务的数据告警并通知，包含自定义通知的实现
date: 2025-11-01 18:00:00
tags:
  - 可观测
---

# 夜莺v8执行自定义脚本并告警通知

## 系统架构图

```mermaid
---
showToolbar: true
---
sequenceDiagram
    participant 脚本 as 自定义脚本
    participant Categraf as Categraf采集器
    participant VM as VictoriaMetrics
    participant 夜莺 as 夜莺v8平台
    participant 引擎 as 告警引擎
    participant 通知 as 通知渠道

    脚本->>Categraf: 执行数据采集
    Categraf->>VM: 输出Influx格式数据
    VM-->>夜莺: 提供时序数据源
    夜莺->>夜莺: 配置告警规则
    夜莺->>引擎: PromQL查询监控数据
    引擎->>引擎: 规则匹配检测
    
    alt 触发告警条件
        引擎->>通知: 发送告警事件
        通知->>通知: 邮件通知
        通知->>通知: 钉钉通知
        通知->>通知: 企业微信通知
        通知->>通知: Webhook通知
    else 正常状态
        引擎-->>夜莺: 继续监控
    end
```

## 数据流说明

1. **数据采集层**: Categraf作为采集器执行自定义脚本，将数据转换为Influx格式
2. **存储层**: VictoriaMetrics作为时序数据库存储监控数据
3. **监控层**: 夜莺v8平台配置数据源和告警规则，使用PromQL进行数据查询
4. **告警层**: 告警引擎根据规则触发告警事件
5. **通知层**: 通过自定义通知配置将告警信息发送到各种渠道

## Categraf

Categraf的文档推荐阅读，[doc](https://flashcat.cloud/docs/content/flashcat-monitor/categraf/1-introduction/)