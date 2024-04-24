---
title: "MySQL中insert数据时怎么用where条件"
description: "记录一下MySQL在做插入操作时怎么去指定条件"
date: 2019-10-26 14:25:53
tags: ["MySQL"]
---

# MySQL中insert数据时怎么用where条件

::: tip 背景
在之前写PHP中想去添加一条数据，并且想查询是否在插入之前有这条数据，我会沙雕的做法（emmm,之前我不知道我这么沙雕了）就是写两个sql语句，分别让他们去单独执行:sleepy:
:::

简单点得一句sql语句，如下：

```sql
INSERT INTO 表名(字段一,字段二) 
	SELECT '字段值','字段值' FROM DUAL 
	WHERE NOT EXISTS(SELECT 数据 FROM 表名 WHERE 条件)
```

例如 ： 

```sql
insert into tb(name,age) select 'fox',20 from DUAL where not EXISTS(select name from tb where name='fox')
```

> DUAL 是虚拟表为了满足  select ...from .....格式

## 2019/10/2补充

现在在用Golang写web业务，补充一下之前的例子吧

```go
// UserAdd 添加用户
func UserAdd(mod *User) error {
	tx, _ := Db.Begin()
	result, err := tx.Exec("insert into user(num,name,pass,phone,email,ctime) SELECT ?,?,?,?,?,? from DUAL where ? NOT IN ( SELECT `num` FROM USER )", mod.Num, mod.Name, mod.Pass, mod.Phone, mod.Email, mod.Ctime, mod.Num)
	if err != nil {
		tx.Rollback()
		return err
	}
	rows, _ := result.RowsAffected()
	if rows < 1 {
		tx.Rollback()
		return errors.New("rows affected < 1")
	}
	tx.Commit()
	return nil
}
```

**通过这个例子可以看出来我们只需要判断num字段时候已经存在，存在情况下就会返回Affected rows: 0** 

**So判断RowsAffected就行，不存在就直接插入了**