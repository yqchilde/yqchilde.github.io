---
title: "Docker安装MySQL后无法登录"
description: "用docker跑了一个mysql容器后，发现进入容器却无法成功登录，记录一下解决方案。"
date: 2021-02-11 15:52:21
tags: ["Docker", "MySQL"]
---

# Docker安装MySQL后无法登录

## 启动MySQL容器

```bash
docker run --name mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=*** -d -v ~/data/docker/mysql:/var/lib/mysql mysql:5.6
```

## 发现错误

1. 使用 Navicat 远程连接发现报 1045 错误
2. 进入容器登录 mysql 发现仍然是`ERROR 1045 (28000): Access denied for user 'root'@'localhost' (using password: YES)`

## 解决问题

这里说一下，在[https://github.com/docker-library/mysql/issues/434](https://github.com/docker-library/mysql/issues/434)这里看到相关问题

有人说使用 `mysql -uroot -p***` 即直接写出密码可以，我试过是不行的，这里贴出具体解决方案。

1. 进入容器中
2. 使用命令 `/usr/bin/mysql_secure_installation`
3. 按照提示进行密码初始化即可

**如下所示：**

```
# /usr/bin/mysql_secure_installation



NOTE: RUNNING ALL PARTS OF THIS SCRIPT IS RECOMMENDED FOR ALL MySQL
      SERVERS IN PRODUCTION USE!  PLEASE READ EACH STEP CAREFULLY!

In order to log into MySQL to secure it, we'll need the current
password for the root user.  If you've just installed MySQL, and
you haven't set the root password yet, the password will be blank,
so you should just press enter here.

Enter current password for root (enter for none):
OK, successfully used password, moving on...

Setting the root password ensures that nobody can log into the MySQL
root user without the proper authorisation.

You already have a root password set, so you can safely answer 'n'.

Change the root password? [Y/n] y
New password:
Re-enter new password:
Password updated successfully!
Reloading privilege tables..
 ... Success!


By default, a MySQL installation has an anonymous user, allowing anyone
to log into MySQL without having to have a user account created for
them.  This is intended only for testing, and to make the installation
go a bit smoother.  You should remove them before moving into a
production environment.

Remove anonymous users? [Y/n] y
 ... Success!

Normally, root should only be allowed to connect from 'localhost'.  This
ensures that someone cannot guess at the root password from the network.

Disallow root login remotely? [Y/n] n
 ... skipping.

By default, MySQL comes with a database named 'test' that anyone can
access.  This is also intended only for testing, and should be removed
before moving into a production environment.

Remove test database and access to it? [Y/n] y
 - Dropping test database...
ERROR 1008 (HY000) at line 1: Can't drop database 'test'; database doesn't exist
 ... Failed!  Not critical, keep moving...
 - Removing privileges on test database...
 ... Success!

Reloading the privilege tables will ensure that all changes made so far
will take effect immediately.

Reload privilege tables now? [Y/n] y
 ... Success!




All done!  If you've completed all of the above steps, your MySQL
installation should now be secure.

Thanks for using MySQL!


Cleaning up...
# mysql -uroot -p
Enter password:
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 17
Server version: 5.6.50 MySQL Community Server (GPL)

Copyright (c) 2000, 2020, Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.
```
