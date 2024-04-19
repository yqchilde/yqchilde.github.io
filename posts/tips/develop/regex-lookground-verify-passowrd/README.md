---
title: "Golang实现一个简单的密码强度验证"
description: "了解正则表达式环视的使用方法，知道Golang为什么不支持该功能，实现一个简单的密码强度验证。"
date: 2020-09-15 23:02:44
categories: ["奇技淫巧"]
tags: ["Golang"]
---

# Golang实现一个简单的密码强度验证

::: tip
最近写了一个正则来表达遇到了一个问题，特此记录
:::

## 了解规则

密码强度规则

1. 必须有大写字母
2. 必须有小写字母
3. 必须有一个数字或者标点符号
4. 密码长度为6到14位

**首先看一下正则表达式**

```go
^((?=.*\d)|(?=.*[\\\^\$\.\*\+\?\{\}\(\)\[\]\|]+))(?=.*[a-z])(?=.*[A-Z]).{6, 14}$
```

![image-20200915220733612](https://pic.yqqy.top/blog/image-20200915220733612.png "匹配结果")

可以看到图片，该正则是可以正确判断的

那么我们把该正则用Go写一下，如下

```go
func main() {
	reg := `^((?=.*\d)|(?=.*[\\\^\$\.\*\+\?\{\}\(\)\[\]\|]+))(?=.*[a-z])(?=.*[A-Z]).{6, 14}$`

	matchString, err := regexp.MatchString(reg, "123456")
	if err != nil {
		log.Println("err is ", err)
	}
	log.Println("Res is ", matchString)
}
```

报错如下

```bash
2020/09/15 21:51:46 err is  error parsing regexp: invalid or unsupported Perl syntax: `(?=`
```

拿着该问题去google一下，发现官方并不支持正则中的 `环视（lookaround）`，说是不符合Go的风格，因为它的复杂度相对比较高，毕竟是要全局去搜一下的

The go regexp package uses RE2 syntax, not PCRE [github.com/google/re2/wiki/Syntax](https://github.com/google/re2/wiki/Syntax)

## 代替方法

那既然正则不支持了，就只能通过写个方法代替了，不过也比较简单，如下

```go
func VerifyPasswordRule(str string, minLen, maxLen int) error {
	var (
		isUpper   = false
		isLower   = false
		isNumber  = false
		isSpecial = false
	)

	if len(str) < minLen || len(str) > maxLen {
		return errors.New("The password must contain uppercase and lowercase letters, numbers or punctuation, and must be 6-14 digits long. ")
	}

	for _, s := range str {
		switch {
		case unicode.IsUpper(s):
			isUpper = true
		case unicode.IsLower(s):
			isLower = true
		case unicode.IsNumber(s):
			isNumber = true
		case unicode.IsPunct(s) || unicode.IsSymbol(s):
			isSpecial = true
		default:
		}
	}

	if (isUpper && isLower) && (isNumber || isSpecial) {
		return nil
	}
	return errors.New("The password must contain uppercase and lowercase letters, numbers or punctuation, and must be 6-14 digits long. ")
}
```

## 了解环视

环视是什么，环视是正则中的一个难点，但是在实际应用起来真的很方面，比如去寻找一个串中是否出现过的这种情况就十分方便，但是由于全局去遍历也就导致了他的复杂度上来。环视不匹配文本中的任何字符，只匹配文本中的特定位置。环视类似于定位符 `^`, `$`, `\b`，不会占用字符

环视分为 `顺序环视`、 `逆序环视`两种

### 顺序环视

| 类型         | 正则表达式 | 匹配成功的条件               |
| :----------- | :--------- | ---------------------------- |
| 肯定顺序环视 | (?=exp)    | 子表达式 能够 匹配 右侧 文本 |
| 否定顺序环视 | (?!exp)    | 子表达式 不能 匹配 右侧 文本 |

顺序环视会检查子表达式 `exp` 能否匹配成功，且只寻找子表达式匹配成功时左侧位置，即子表达式能够匹配右侧文本

![image-20200915225541491](https://pic.yqqy.top/blog/image-20200915225541491.png "顺序环视")

### 逆序环视

| 类型         | 正则表达式 | 匹配成功的条件               |
| ------------ | ---------- | ---------------------------- |
| 肯定逆序环视 | (?<=exp)   | 子表达式 能够 匹配 左侧 文本 |
| 否定逆序环视 | (?<!exp)   | 子表达式 不能 匹配 左侧 文本 |

逆序环视同样会检查字表达式子 `exp`的匹配，这次匹配的是左侧文本

![image-20200915225506021](https://pic.yqqy.top/blog/image-20200915225506021.png "逆序环视")

### 例子

> 比较经典的有数字显示问题，比如我们常见到的 `12345` 要显示成 `12,345`，就是从右往左每隔三个位置加一个逗号

```go
// 正序环视
(?<=\d)(?=(\d{3})+$)

// 逆序环视
(?=(\d{3})+$)(?<=\d)
```

用以上的表达式匹配位置替换为逗号即可