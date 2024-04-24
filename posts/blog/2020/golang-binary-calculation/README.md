---
title: "Golang实现进制计算两种方法"
description: "Golang实现进制计算两种方法，逐位计算和位操作，了解丰富的math/big包"
date: 2020-04-02 08:07:56
tags: ["Golang"]
---

# Golang实现进制计算两种方法

::: tip
本文将以二进制计算作为例子实现
:::

**题目：** 

给定两个二进制字符串，返回他们的和（用二进制表示）。

输入为非空字符串且只包含数字 1 和 0。

示例 1:

```go
输入: a = "11", b = "1"
输出: "100"
```

示例 2:

```go
输入: a = "1010", b = "1011"
输出: "10101"
```

### 逐位计算

> 解法一：逐位计算

```go
func addBinary(a string, b string) string {
	m, n := len(a), len(b)
	if m > n {
		return addBinary(b, a)
	}

	buf := make([]byte, n+1)
	carry := 0
    // 从后往前依次算尾数结果
	for i, j := n-1, m-1; i >= 0; i-- {
		if j >= 0 {
			carry += int(a[j] - '0')
			j--
		}
		carry += int(b[i] - '0')
        // 判断进位
		buf[i+1] = byte(carry%2 + '0')
		carry /= 2
	}
    // 判断是否有进位
	if carry == 0 {
		return string(buf[1:])
	}
	buf[0] = '1'
	return string(buf)
}
```

### 位运算

XOR 操作得到两个数字无进位相加的结果。

![](https://pic.yqqy.top/blog/20200402161845.png "图1")

进位和两个数字与操作结果左移一位对应。

![](https://pic.yqqy.top/blog/20200402161907.png "图2")

首先计算两个数字的无进位相加结果和进位，然后计算无进位相加结果与进位之和。同理求和问题又可以转换成上一步，直到进位为 0 结束。

**计算：**

- 把 aa 和 bb 转换成整型数字 xx 和 yy，xx 保存结果，yy 保存进位。
- 当进位不为 0：y != 0：
  - 计算当前 xx 和 yy 的无进位相加结果：answer = x^y。
  - 计算当前 xx 和 yy 的进位：carry = (x & y) << 1。
  - 完成本次循环，更新 x = answer，y = carry。
- 返回 xx 的二进制形式。

> 位运算
>
> 运用支持库 [math/big](https://golang.org/pkg/math/big/) ，里面的大数计算

```go
func addBinary(a string, b string) string {
	x, _ := new(big.Int).SetString(a, 2)
	y, _ := new(big.Int).SetString(b, 2)
	zero, _ := new(big.Int).SetString("0", 2)

    // 
	for y.Cmp(zero) != 0 {
		answer  := new(big.Int).Xor(x, y)
		carry := x.And(x, y).Lsh(x, 1)
		x, y = answer, carry
	}
	return fmt.Sprintf("%b", x)
}
```

