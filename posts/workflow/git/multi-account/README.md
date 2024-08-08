---
sort: 3
title: "Git 多账户配置"
date: 2024-08-08 12:08:15
tags: [git]
---

# Git 多账户配置

:::tip
针对在本地开发有github多个账户，或者多个平台（github、gitlab）多个账户的情况，配置好后推送到不同项目非常方便，提升开发效率，属于开发必备知识
:::

## 1.生成密钥对

```shell
cd ~/.ssh

# 用来生成邮箱为yqchilde@gmail.com的公钥和私钥
# 作为个人使用，回车下一步将文件命名为 id_rsa_github_personal
ssh-keygen -t rsa -C "yqchilde@gmail.com"

# 用来生成邮箱为yqchilde@domain.com的公钥和私钥
# 作为公司使用，回车下一步将文件命名为 id_rsa_github_company
ssh-keygen -t rsa -C "yqchilde@domain.com"
```

## 2.密钥对添加到本地

```shell
ssh-add ~/.ssh/id_rsa_github_personal
ssh-add ~/.ssh/id_rsa_github_company
```

## 3.配置Config

```shell
vim ~/.ssh/config

# 增加如下配置
Host github-personal
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_rsa_github_personal

Host github-company
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_rsa_github_company
```

其中`Host`为别名，随便起，`HostName`为实际域名，`User`为用户名，`IdentityFile`为密钥文件路径

## 4.公钥添加到托管平台

比如GitHub，点击头像，选择Settings，点击SSH and GPG keys，点击New SSH key，填入别名和公钥，保存即可

## 5.本地测试配置

```shell
# ssh -T 用户名@别名
ssh -T User@Host

# 这是成功的样子
~ » ssh -T git@github-personal
# Hi yqchilde! You've successfully authenticated, but GitHub does not provide shell access.
---------------------------------------------------------------------------------------------------------------
~ » ssh -T git@github-company
# Hi yxxxxxxx! You've successfully authenticated, but GitHub does not provide shell access.
```

## 6.拉取项目

选择ssh方式

```shell
git clone User@Host:Personal/personal.git

# 比如
git clone git@github-personal:Personal/personal.git
git clone git@github-company:Company/company.git
```