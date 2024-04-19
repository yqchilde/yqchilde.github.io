---
title: "MySQL的优化笔记"
description: "整理MySQL优化相关的笔记，持续补充 🌈"
date: 2021-11-21 20:12:46
categories: ["奇技淫巧"]
tags: ["MySQL"]
---

# MySQL的优化笔记

## 表设计の角度

### 表设计原则

1. 一对一，通过主键关联
2. 一对多，在多的一方设置外键
3. 多对多，增加中间表，持有双方外键

### 使用反范式设计

严格采用一、二、三范式的设计会将系统中的表拆分的非常多，不利于查询。可以将一些冗余的字段加在必要的查询表中，从而将原本需要多表关联查询变成了单表查询，这就是反范式的目的。

**优缺点：**

1. <font color=#389e0d>单表查询易于优化，易于管理。单表的索引优化也比多个表好做，在进行排序时，多个表关联查询后order by往往是很复杂的，设计成反范式后易于简单化。</font> 
2. <font color=#389e0d>SQL语句简单，有利于程序开发，团队协作。</font>
3. <font color=#f5222d>存在数据冗余，写操作时需要额外更新从表数据。</font>
4. <font color=#f5222d>不合理的反范式设计会让表变得臃肿不堪。</font>

### 设置代理主键

什么是自然主键，什么又是代理主键？

- 自然主键是指事物属性中的自然唯一标识，比如身份证号，学号，工号等
- 代理主键是指与业务无关的，无意义的数字序列值

通常设计一个自增主键作为代理主键，将具体的业务逻辑ID加上索引作为自然主键，且因为代理主键使用了自增，插入时是有顺序的，对B+Tree插入影响范围较小，这样计算量也是最小的。

## 索引优化の角度

### 了解 - 索引的形式

索引的存储形式是由存储引擎决定的

**数据表索引分类**

- 从存储结构上划分：
  - BTree索引（B-Tree 或 B+Tree）
  - Hash索引
  - full-index全文索引
  - R-Tree索引，通常用于GIS系统来表示空间数据
- 从应用分层上划分：
  - 普通索引，普通的字段索引
  - 唯一索引，常用于主键的索引
  - 复合索引，用于多个条件的查询组织
- 从数据的物理顺序与键值逻辑（索引）顺序关系划分：
  - 聚集索引，指插入顺序与索引建立顺序一致
  - 非聚集索引

B+Tree结构

![img1](https://pic.yqqy.top/blog/20211121205415.png "图1")

查找8和9的路径为：

![img2](https://pic.yqqy.top/blog/20211121205136.gif "图2")

### 了解 - MySQL常用的索引

- B+Tree索引 - 适合用于范围查找
  - InnoDB与MyISAM采用的是B+Tree索引
  - B+Tree索引采用树形链表结构建立数据“目录”
  - 在其他字段上的索引通过和主键的索引产生关联来绑定
- Hash索引 - 适合于精确匹配
  - Hash索引基于哈希表实现
  - 精确匹配所有列的查询才有效，不支持范围查询，模糊查询及排序
  - Hash索引为每条数据生成一个HashCode
  - Hash索引只包含哈希值和行指针
  - Hash取值速度非常快，但索引选择性很低时不建议使用
  - MySQL目前只有Memory **显示** 支持Hash索引

> 上文说了只有在memory引擎中才会显示支持hash索引，那么在innodb中的hash索引如何创建呢？其实在Innodb中会自动帮我们创建，这里记一下他的几个特点：
> 1. InnoDB存储引擎只支持显示创建BTree索引
> 2. 当数据精确匹配时MySQL会自动生成HashCode，存入缓存

### 了解 - MySQL中的锁

|        职责分类         | 粒度分类 |
| :---------------------: | :------: |
|      共享锁 - 读锁      |  行级锁  |
| 独占锁（排他锁） - 写锁 |  表级锁  |

- 共享锁：
  - 这个数据可以被所有的事务连接、共享，持有该数据共享锁的所有进程都可以访问到该数据，共享锁只服务于访问，又称为读锁。
- 独占锁：
  - 当某一个线程获得了某一条数据的访问权限时，其他所有的数据操作都将进入等待的操作，直到解锁，又称为写锁。独占锁与共享锁是互斥关系。
- 行级锁：
  - 只对当前修改的数据进行锁定，如果不用程序访问不同数据，那彼此间是互不影响的可以并行操作的。行级锁只出现于多个程序访问同一数据时。
- 表级锁：
  - 只要获取到表级锁，无论里面更新几条数据，该表都是锁定状态，都无法修改成功。
  - 表级锁锁定范围比较大，行级锁锁定范围比较小，从并发性角度来说，行级锁性能比表级锁性能好；从锁自身状态管理角度来说，行级锁的开销要比表级锁大。

### 了解 - InnoDB引擎

- InnoDB支持事务
- InnoDB默认使用`行级锁`
- InnoDB具备良好的高并发特性

在InnoDB中只有利用索引的更新、删除操作，才可以使用行级锁，不能使用索引的写操作则是表级锁。
在实际开发的时候，如果遇到写操作，一定要确保`update/delete`语句的条件要能够使用索引，否则就会锁表，程序将不具备并发性。

### 了解 - 什么情况下不会用到索引

- 索引选择性太差
- `<>`或`not in`无法使用索引
- `is null`会使用索引，`is not null`不会使用索引
- `where`子句跳过左侧索引列，直接查询右侧索引字段
- 对索引列进行计算或使用函数

### 优化 - 使用索引优化排序

当`order by`字段与索引字段顺序/排序方向相同时，索引可以优化排序速度

- 在单字段情况下，索引支持升降序，比如：
```sql
# field上面有索引，where时走了索引，order by上也走了索引
select * from table where field < 10000 order by field;
```

- 在多字段情况下，左侧字段必须是升序，且顺序不允许打乱
```sql
# order by field必须为升序，如果用了desc，用explain分析则会是 Using filesort，代表效率较差
select * from table where field < 10000 order by field, field2; 
```

### 优化 - 删除冗余索引

- 使用`pt-duplicate-key-checker`工具，他可以帮助检测表中重复的索引或者主键，仅支持linux环境。
- 执行实用索引SQL语句，按照索引维度看一下磁盘I/O的处理情况
```sql
SELECT
	object_type, object_schema, object_name, index_name,
	count_read, count_fetch, count_insert,
	count_update, count_delete
FROM
	`performance_schema`.table_io_waits_summary_by_index_usage
ORDER BY
	sum_timer_wait DESC;
```

- count_read: 索引在计算过程中读取了多少行
- count_fetch: 最终查询结果是多少行
- sum_timer_wait: 利用索引查询的总时间
- 当后面几个查询结果全为0时，代表MySQL服务运行起来后索引没有被使用过，可以被删掉

### 优化 - SQL编写

**使用where条件**

- 在精确匹配时，允许使用btree索引，比如`where uid = 10001`
- 在范围匹配时，允许使用btree索引，比如`where uid > 10000 and uid < 10005`
- 在匹配类型不一致时，比如`where uid = 10001`换成`where uid = "10001"`中，仍然可以使用btree索引，这是因为查询优化器会自动进行类型转换，但建议使用与定义相符的类型，减少转换操作。不过当使用`where uid like "1000%"`时，这时候走的就是全表扫描，查询优化器无法进行类型转换。

****

**使用like条件**

- 在字符串字段中，btree索引允许进行“前缀查询”，比如`where sno like "20210901000%"`，不过查询效率与前缀有关，当选择性太低的时候，依然是全表查询
- 在字符串字段中，后缀查询和模糊匹配时，btree索引均不支持，比如`where sno like "%09010001"` 和 `where sno like "%0901%"`


**使用复合索引**

- 复合索引查询条件必须包含左侧列
- 直接书写右侧列将导致数据无法查询
- `<>`与`not`会导致不使用索引

### 优化 - 减少表与索引碎片

在数据进行频繁的增、删、改操作后，操作数据会重新组织结构。在组织过程中，可能出现一些空间的浪费以及数据组织上的不合理地方。如下两条命令就是解决该问题的：

- `analyze table 表名`，让统计信息进行重新计算，从而让查询分析器在执行sql时基于新计算的准确的结果选择最合适的优化方案。
- `optimize table 表名`，对于表数据进行优化，连续的数据之间可能存在“缝隙”，在大量数据操作后，“缝隙”越来越大，此外删除的数据是被空闲下来，并不会在“表空间”这个文件中将删除数据的空间进行释放，故使用该命令重新优化表空间。**执行该命令会锁表，所以一定要在维护期间，否则会造成I/O阻塞**

## MySQL自带の分析器

### 开启慢SQL日志分析

1. 首选要开启慢SQL日志功能
```sql
# 设置慢sql日志状态
SET GLOBAL slow_query_log = on;

# 设置慢sql执行时间阈值，单位（秒）
SET GLOBAL long_query_time = 0.3; # 代表300毫秒

# 设置慢sql日志保存文件，路径为mysql/data
SET GLOBAL show_query_log_file = "show-sql.log"
```

### 利用explain执行计划

- id：计划ID
- select_type：查询类型
  - SIMPLE：简单查询，指查询不包含子查询和union
  - PRIMARY：复杂查询中最外侧的select
  - DERIVED：包含在from子句中的子查询，mysql会将结果存放在一个临时表中，也称为派生表（derived的英文含义）
  - SUBQUERY：子查询
  - UNION：连接查询
  - UNION RESULT：连接查询后的结果集
- table：访问的具体表名
- partitions：分区表
- type：表示关联类型或访问类型，即MySQL决定如何查找表中的行，执行效率排序为：
  - system
  - **const**
    - mysql能对查询的某部分进行优化并将其转化成一个常量，用于primary key 或 unique key的所有列与常数比较时，所以表最多有一个匹配行，读取一次，速度比较快
    - `explain select * from (select * from film where id = 1) tmp;`
  - **eq_ref**
    - primary key 或 unique key索引的所有部分被连接使用，最多只会返回一条符合条件的记录。这可能是在const之外最好的联结类型了，简单的select查询不会出现这种type
    - `explain select * from film_actor left join film on film_actor.film_id = film.id`
  - **ref**
    - 相比eq_ref，不使用唯一索引，而是使用普通索引或者唯一性索引的部分前缀，索引要和某个值相比较，可能会找到多个符合条件的行
    - `explain select * from film where name = "film1"`
  - fulltext
  - **ref_or_null**
    - 类似ref，但是可以搜索值为NULL的行
    - `explain select * from film where name = "film1" or name is null;`
  - index_merge
  - unique_subquery
  - index_subquery
  - **range**
    - 范围扫描通常出现在`in()`，`between`，`>`， `<`，`>=`等操作中，使用一个索引来检索给定范围的行
    - `explain select * from actor where id > 1;`
  - **index**
    - 和ALL一样，不同就是mysql只需扫描索引树，这通常比ALL快一些
    - `explain select count(*) from film;`
  - **ALL**
    - 全表扫描，意味着mysql需要从头到尾去查找所需要的行，通常这种情况下需要增加索引来优化了
- possible_keys：显示查询可能使用哪些索引来查找
- key：显示mysql实际采用哪个索引来优化对该表的访问
- key_len：显示mysql在索引里使用的字节数，通过这个值可以算出具体使用了索引的哪些列
- ref：显示了在key列记录的索引中，表查找值所用到的列或常量，常见的有：const、func、NULL、字段名（例：film.id）
- rows：是mysql估计要读取并检测的行数，注意这个不是结果集里的行数
- filtered：是一个百分比的值，代表 `(rows * filtered) / 100`，这个结果将于前表产生交互
- Extra：展示的是额外信息
  - distinct:
    - 一旦mysql找到了与行相联合匹配的行，就不再搜索了
    - `explain select distinct name from film left join film_actor on film.id = film_actor.film_id;`
  - Using index:
    - 又称为 **索引覆盖**，这发生在对表的请求列都是同一索引的部分的时候，返回的列数据只使用了索引中的信息，而没有再去访问表中的行记录，是性能高的表现
    - `explain select id from film order by id;`
  - Using where:
    - mysql服务器将在存储引擎检索行后再进行过滤，就是先读取整行数据，再按where条件进行检查，符合就留下，不符合就丢弃
    - `explain select * from film where id > 1;`
  - Using temporary:
    - mysql需要创建一张临时表来处理查询，出现这种情况一般是要进行优化的，首先是想到利用索引来优化
    - `explain select distinct name from actor;`
    - 当使用语句`create index idx_name on actor(name);`创建索引后，将会变成Using index
  - Using filesort:
    - 1. 采用文件扫描对结果进行计算排序，效率很差
    - `explain select * from actor order by name;`
    - 2. 尽管在`name`上加了索引也不会使用Using index，这是因为对于排序，只有select字段与order by字段都被索引覆盖时才允许使用Using index，比如
    - `explain select name from actor order by name;`
    - 3. 再加一个字段，并且添加索引后查询，extra结果是`Using index; Using filesort`
    - `explain select name, update_time from actor order by update_time, name;`
    - `create index idx_name_ut on actor(name, update_time);`
    - 4. 只有必须按照复合索引的顺序来才会使用Using index，比如
    - `explain select name, update_time from actor order by name, update_time;`

> id = 1 的那张表是查询的驱动表，id按照升序排列看，按顺序是依次的select，尽可能少的使用union，因为union result是使用的临时表，临时表没有索引
