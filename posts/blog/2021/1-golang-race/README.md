---
title: "Golang的Data Race问题"
description: "很多时候，当我们写出一个程序时，我们并不知道这个程序在并发情况下会不会出现什么问题。所以在本质上说，goroutine的使用增加了函数的危险系数。比如一个全局变量，如果没有加上锁，我们写一个比较庞大的项目下来，根本不知道这个变量是不是会引起多个goroutine竞争，race参数就是提前帮我们检查是否存在竞争。"
date: 2021-01-11 23:43:21
tags: ["Golang"]
---

# Golang的Data Race问题

## 了解Race

很多时候，当我们写出一个程序时，我们并不知道这个程序在并发情况下会不会出现什么问题。所以在本质上说，goroutine的使用增加了函数的危险系数。比如一个全局变量，如果没有加上锁，我们写一个比较庞大的项目下来，根本不知道这个变量是不是会引起多个goroutine竞争。
官网的文章 [Introducing the Go Race Detector](http://blog.golang.org/race-detector) 给出的例子就说明了这点：

```go
package main

import(
    "time"
    "fmt"
    "math/rand"
)

func main() {
    start := time.Now()
    var t *time.Timer
    t = time.AfterFunc(randomDuration(), func() {
        fmt.Println(time.Now().Sub(start))
        t.Reset(randomDuration())
    })
    time.Sleep(5 * time.Second)
}

func randomDuration() time.Duration {
    return time.Duration(rand.Int63n(1e9))
}
```

这个例子看起来没有任何问题，但是实际上， `time.AfterFunc`是会另外启动一个goroutine来进行计时和执行func()。由于 func 中有对  `t(Timer)`进行 `Reset`操作，而主goroutine也有对t进行操作 `t = time.After`。这个时候，其实有可能会造成两个goroutine对同一个变量进行竞争的情况。

这个例子有点复杂，简化一下，使用一个简单的例子：

```go
package main

import(
    "time"
    "fmt"
)

func main() {
    a := 1
    go func(){
        a = 2
    }()
    a = 3
    fmt.Println("a is ", a)

    time.Sleep(2 * time.Second)
}
```

在这段代码中，go func 触发的goroutine会修改 a 。主goroutine也会对对 a 进行修改。但是如果我们只运行 `go run` ，我们可能往往不会发现什么太大的问题。

```bash
go run main.go
a is 3
```

可喜的是，golang在1.1之后引入了竞争检测的概念，我们可以使用 `go run -race` 或者 `go build -race` 来进行竞争检测。

Golang语言内部大概的实现就是同时开启多个 goroutine 执行同一个命令，并记录每个变量的状态。
如果用race来检测上面的程序，我们就会看到输出：

```bash
go run -race main.go

a is  3
==================
WARNING: DATA RACE
Write at 0x00c00012c058 by goroutine 7:
  main.main.func1()
      E:/GoModule/go-learning/main.go:11 +0x44

Previous write at 0x00c00012c058 by main goroutine:
  main.main()
      E:/GoModule/go-learning/main.go:13 +0x92

Goroutine 7 (running) created at:
  main.main()
      E:/GoModule/go-learning/main.go:10 +0x84
==================
Found 1 data race(s)
exit status 66
```

这个命令输出了 Warning， 告诉我们，goroutine7 运行到第11行进行触发近竞争了。而且从第14行得知groutine7是在第10行创建的，这样我们就知道这个程序在这个地方写的有问题了。

当然这个参数会引发CPU和内存的使用增加，所以基本是在测试环境使用，不是在正式环境开启。

## 解决方案

1. 利用atomic包来原子操作

```go
package main

import (
  "fmt"
  "sync/atomic"
  "time"
)

var value atomic.Value

func main() {
  a := 1
  value.Store(a)
  go func() {
    a := value.Load().(int)
    a = 2
    value.Store(a)
  }()
  a = value.Load().(int)
  a = 3
  value.Store(a)
  fmt.Println("a is ", a)

  time.Sleep(2 * time.Second)
}
```

2. 利用Mutex锁

```go
package main

import (
	"fmt"
	"sync"
	"time"
)

var mu sync.Mutex

func main() {
	a := 1
	go func() {
		mu.Lock()
		a = 2
		mu.Unlock()

	}()
	mu.Lock()
	a = 3
	fmt.Println("a is ", a)
	mu.Unlock()

	time.Sleep(2 * time.Second)
}
```


## 参考资料

* [golang中的race检测](https://www.cnblogs.com/yjf512/p/5144211.html)

* [谈谈 Golang 中的 Data Race](https://ms2008.github.io/2019/05/12/golang-data-race/)