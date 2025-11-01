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
flowchart TD
    subgraph DataCollection[数据采集层]
        A[自定义脚本] -->|执行采集| B[Categraf采集器]
        B -->|输出Influx格式数据| C[VictoriaMetrics]
    end

    subgraph MonitoringPlatform[监控平台层]
        C -->|作为数据源| D[夜莺v8平台]
        D -->|配置告警规则| E[PromQL查询引擎]
        E -->|触发告警| F[告警引擎]
    end

    subgraph Notification[通知层]
        F -->|调用通知渠道| G[自定义通知配置]
        G --> H[邮件通知]
        G --> I[钉钉通知]
        G --> J[企业微信通知]
        G --> K[Webhook通知]
    end

    style DataCollection fill:#e1f5fe
    style MonitoringPlatform fill:#f3e5f5
    style Notification fill:#e8f5e8
```

## 数据流说明

1. **数据采集层**: Categraf作为采集器执行自定义脚本，将数据转换为Influx格式
2. **存储层**: VictoriaMetrics作为时序数据库存储监控数据
3. **监控层**: 夜莺v8平台配置数据源和告警规则，使用PromQL进行数据查询
4. **告警层**: 告警引擎根据规则触发告警事件
5. **通知层**: 通过自定义通知配置将告警信息发送到各种渠道

## Categraf

categraf的文档推荐阅读，[doc](https://flashcat.cloud/docs/content/flashcat-monitor/categraf/1-introduction/)