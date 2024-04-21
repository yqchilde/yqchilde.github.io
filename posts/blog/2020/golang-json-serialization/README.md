---
title: "Golang的json序列化详解"
description: "Golang解析Json数组的一些技巧，奇怪的知识又增加了！"
date: 2020-05-16 13:41:00
categories: ["后端"]
tags: ["Golang"]
---

# Golang的json序列化详解

## 普通序列化

```go
type A struct {
	Name string `json:"name"`
	Age  int    `json:"age"`
	Sex  string `json:"sex"`
}

func main() {
	a := &A{
		Name: "张三",
		Age:  18,
		Sex:  "男",
	}

	marshal, err := json.Marshal(a)
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(string(marshal))
}
```

输出结果：`{"name":"张三","age":18,"sex":"男"}`

## 忽略某个字段

如果想在序列化/反序列化的时候忽略掉结构体中的某个字段，可以在`tag`字段中添加`-`

```go
type A struct {
	Name string `json:"name"`
	Age  int    `json:"-"`
	Sex  string `json:"-"`
}

func main() {
	a := &A{
		Name: "张三",
		Age:  18,
		Sex:  "男",
	}

	marshal, err := json.Marshal(a)
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(string(marshal))
}
```

输出结果：`{"name":"张三"}`

## 忽略空值字段

当struct中的字段没有值时，`json.Marshal()`序列化的时候不会忽略这些字段，而是输出默认字段的类型零值，如果想要忽略掉这些值的字段时，可以在对应字段添加`omitempty`tag

```go
type User struct {
	Name  string   `json:"name"`
	Email string   `json:"email"`
	Hobby []string `json:"hobby"`
}

func main() {
	a := &User{
		Name: "张三",
	}

	marshal, err := json.Marshal(a)
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(string(marshal))
}
```

输出结果：`{"name":"张三","email":"","hobby":null}`

添加`omitempty`tag，看看效果

```go
type User struct {
	Name  string   `json:"name"`
	Email string   `json:"email,omitempty"`
	Hobby []string `json:"hobby,omitempty"`
}
```

输出结果：`{"name":"张三"}`

## 忽略嵌套结构体空值字段

```go
type User struct {
	Name  string   `json:"name"`
	Email string   `json:"email,omitempty"`
	Hobby []string `json:"hobby,omitempty"`
	Profile
}

type Profile struct {
	Website string `json:"site"`
	SLogan  string `json:"slogan"`
}

func main() {
	a := &User{
		Name: "张三",
		Hobby: []string{"足球", "双色球"},
	}

	marshal, err := json.Marshal(a)
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(string(marshal))
}
```

匿名嵌套`Profile`时序列化后的json串为单层的：

`{"name":"张三","hobby":["足球","双色球"],"site":"","slogan":""}`

想要变成嵌套的json串，需要改为具名嵌套或定义字段tag

```go
type User struct {
	Name    string   `json:"name"`
	Email   string   `json:"email,omitempty"`
	Hobby   []string `json:"hobby,omitempty"`
	Profile `json:"profile"`
}
```

`{"name":"张三","hobby":["足球","双色球"],"profile":{"site":"","slogan":""}}`

想要在嵌套的结构体为空值时，忽略该字段，仅添加`omitempty`是不够的，例如给Profile添加tag`omitempty`

```go
type User struct {
	Name    string   `json:"name"`
	Email   string   `json:"email,omitempty"`
	Hobby   []string `json:"hobby,omitempty"`
	Profile `json:"profile,omitempty"`
}
```

输出仍然是:

`{"name":"张三","hobby":["足球","双色球"],"profile":{"site":"","slogan":""}}`

这时候换成`指针`就可以了

```go
type User struct {
	Name     string   `json:"name"`
	Email    string   `json:"email,omitempty"`
	Hobby    []string `json:"hobby,omitempty"`
	*Profile `json:"profile,omitempty"`
}
```

输出结果变为`{"name":"张三","hobby":["足球","双色球"]}`

## 不修改原结构体忽略空值字段

现在有一个案例，需要json序列化`User`，但是不想把密码也序列化，又不想修改`User`结构体，这个时候我们就可以使用创建另外一个结构体`PublicUser`匿名嵌套原`User`，同时指定`Password`字段为匿名结构体指针类型，并添加`omitempty`tag，示例如下

```go
type User struct {
	Name     string `json:"name"`
	Password string `json:"password"`
}

type PublicUser struct {
	*User              // 匿名嵌套
	Password *struct{} `json:"password,omitempty"`
}

func main() {
	a := &User{
		Name:     "张三",
		Password: "123456",
	}

	marshal, err := json.Marshal(PublicUser{
		User: a,
	})
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(string(marshal))
}
```

输出结果：`{"name":"张三"}`，理解为于引用类型引用

## 优雅处理字符串格式的数字

有时候，前端传递来的json数据中可能会使用字符串类型的数字，这个时候可以在结构体tag中添加`string`来告诉json包从字符串中解析相应字段的数据

```go
type Card struct {
	ID    int64   `json:"id,string"`
	Score float64 `json:"score,string"`
}

func main() {
	jsonStr := `{"id":"123456","score":"88.50"}`
	var c1 Card

	err := json.Unmarshal([]byte(jsonStr), &c1)
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println(c1)
}
```

## 整数变成浮点数

在JSON协议中是没有整形和浮点型之分的，他们统称为number，json字符串中的数字经过Go语言中的json包反序列化之后都会变成`float64`类型

```go
func main() {
	var m = make(map[string]interface{}, 1)
	m["count"] = 1 // int
	b, err := json.Marshal(m)
	if err != nil {
		fmt.Printf("marshal failed, err:%v\n", err)
	}
	fmt.Println(string(b))
	// json string -> map[string]interface{}
	var m2 map[string]interface{}
	err = json.Unmarshal(b, &m2)
	if err != nil {
		fmt.Printf("unmarshal failed, err:%v\n", err)
		return
	}
	fmt.Printf("value:%v\n", m2["count"]) // 1
	fmt.Printf("type:%T\n", m2["count"])  // float64
}
```

可以看到上面代码输出的结果，int数值类型变成了float64，如果想更合理的处理数字就需要使用`decoder`去反序列化

```go
func main() {
	var m = make(map[string]interface{}, 1)
	m["count"] = 1 // int
	b, err := json.Marshal(m)
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(string(b))

	var m2 map[string]interface{}
	// 使用decoder方式反序列化，指定使用number类型
	decoder := json.NewDecoder(bytes.NewReader(b))
	decoder.UseNumber()
	err = decoder.Decode(&m2)
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Printf("value:%v\n", m2["count"]) // 1
	fmt.Printf("type:%T\n", m2["count"])  // json.Number

	// 将m2["count"]转为json.Number之后调用Int64()方法获得int64类型的值
	count, err := m2["count"].(json.Number).Int64()
	if err != nil {
		fmt.Printf("parse to int64 failed, err:%v\n", err)
		return
	}
	fmt.Printf("type:%T\n", int(count)) // int
}
```

`json.Number`的源码定义如下：

```go
// A Number represents a JSON number literal.
// Number表示JSON数字文字
type Number string

// String returns the literal text of the number.
// 字符串返回数字的文字文本字符串返回数字的文字文本
func (n Number) String() string { return string(n) }

// Float64 returns the number as a float64.
// Float64将数字返回为float64
func (n Number) Float64() (float64, error) {
	return strconv.ParseFloat(string(n), 64)
}

// Int64 returns the number as an int64.
// Int64将数字返回为int64
func (n Number) Int64() (int64, error) {
	return strconv.ParseInt(string(n), 10, 64)
}
```

我们在处理number类型的json字段时需要得到`json.Number`类型，然后根据该字段的实际类型调用`Float64()`或`Int64()`

## 自定义解析时间字段

Go语言内置的json包使用`RFC3339`标准中定义的时间格式，对我们序列化时间字段的时候有很多限制

```go
func main() {
	p1 := Post{CreateTime: time.Now()}
	marshal, err := json.Marshal(p1)
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println(string(marshal))

	jsonStr := `{"create_time":"2020-05-16 12:25:42"}`
	var p2 Post
	if err := json.Unmarshal([]byte(jsonStr), &p2); err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println(p2)
}
```

上面的代码输出结果如下：

```go
{"create_time":"2020-05-16T21:23:48.1498199+08:00"}

parsing time ""2020-05-16 12:25:42"" as ""2006-01-02T15:04:05Z07:00"": cannot parse " 12:25:42"" as "T"
```

这个报错说明json包不识别我们常用的字符串时间格式，如`2020-05-16 12:25:42`
不过我们通过实现`json.Marshaler`/`json.Unmarshaler`接口实现自定义的事件格式解析。
实现`decode`包下的两个接口函数`MarshalJSON`和`UnmarshalJSON`，而且这个也可以作为实现**自定义解析**

```go
func (ct *CustomTime) UnmarshalJSON(b []byte) (err error) {
	fmt.Println(string(b))
	s := strings.Trim(string(b), "\"")
	if s == "null" {
		ct.Time = time.Time{}
		return
	}
	ct.Time, err = time.Parse(ctLayout, s)
	return
}

func (ct *CustomTime) MarshalJSON() ([]byte, error) {
	if ct.Time.UnixNano() == nilTime {
		return []byte("null"), nil
	}
	return []byte(fmt.Sprintf("\"%s\"", ct.Time.Format(ctLayout))), nil
}
```

## 使用匿名结构体添加字段

使用内嵌结构体能够扩展结构体的字段，但有时候我们没有必要单独定义新的结构体，可以使用匿名结构体简化操作

```go
type UserInfo struct {
	ID int `json:"id"`
	Name string `json:"name"`
}

func main()  {
	u1 := UserInfo{
		ID:   123456,
		Name: "张三",
	}

	// 使用匿名结构体内嵌User并添加额外字段Token
	b, err := json.Marshal(struct {
		*UserInfo
		Token string `json:"token"`
	}{
		&u1,
		"91je3a4s72d1da96h",
	})
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println(string(b))
}
```

输出结果为：`{"id":123456,"name":"张三","token":"91je3a4s72d1da96h"}`

## 使用匿名结构体组合多个结构体

同理，也可以使用匿名结构体来组合多个结构体来序列化与反序列化数据

```go
type Student struct {
	Name string `json:"name"`
}

type Teacher struct {
	Subject string `json:"subject"`
}

func main()  {
	stu := Student{Name: "张三"}
	tea := Teacher{Subject: "CS"}

	// 使用匿名结构体内嵌User并添加额外字段Token
	b, err := json.Marshal(struct {
		*Student
		*Teacher
	}{
		&stu,
		&tea,
	})
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println(string(b))
}
```

输出结构为：`{"name":"张三","subject":"CS"}`

## gjson库

```go
package main

import (
	"fmt"
	"github.com/tidwall/gjson"
)

const data string = `{"good":[{"name":"chicken"}]}`

func main() {
	get := gjson.Get(data, "good.#.name")
	fmt.Println(get)
}
```

gjson的其他方法查看官方api就好

## 参考文章

* [你需要知道的那些go语言json技巧](https://www.liwenzhou.com/posts/Go/json_tricks_in_go/)

* [https://github/tidwall/gjson](https://github.com/tidwall/gjson)
