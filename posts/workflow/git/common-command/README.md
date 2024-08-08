---
sort: 2
title: "Git 常用命令"
date: 2024-04-25 09:44:12
tags: [git]
---

# Git 常用命令

## 删除本地分支以及远程分支

```shell
// 修改本地分支
git branch -m old_branch new_branch

// 删除本地分支
git branch -d old_branch

// 删除远程分支
git push origin :old_branch

// 新增远程分支
git push --set-upstream origin new_branch

// 清理无效的远程追踪分支
git remote prune origin

// 强制更新远程分支
git remote update origin --prune

// 从远端加载并在本地创建一个分支
git checkout -b myBranch origin/myBranch

// 强制git pull覆盖
git fetch --all
git reset --hard origin/master
git pull

// 撤回已提交但未推送（保持修改状态）
git log # 找到id
git reset id
```

## 修改远程分支名字

```shell
# 1. 切到要修改分支下
git checkout br_rename_old

# 2. 修改本地分支名字
git branch -m old_name new_name

# 3. 将远程分支删掉
git push origin --delete old_name

# 4. 将本地分支推送到远程
git push --set-upstream origin new_name
```

## 重置到某个commit

```shell
git log
git reset --hard <commitid>
git push origin HEAD --force
```

## 使用submodule
```shell
# 添加
git submodule add <new_submodule_url> <submodule_path>

# 删除
git submodule deinit <submodule_path>
git rm <submodule_path>
rm -rf .git/modules/<submodule_path>
```

## 强制改变仓库

```shell
git remote set-url origin https://github.com/yqchilde/xxx.git
git config user.name "yqchilde"    
git config user.email "yqchilde@gmail.com"             
git push origin main 
```