---
title: "Golang的Context学习"
description: "Context包是什么很强大的包，他可用户web处理多个goroutine数据间关系，亦可处理超时控制和上下文控制，总之，要好好理解一下了。"
date: 2020-05-15 16:07:35
categories: ["后端"]
tags: ["Golang"]
---

# Golang的Context学习

![img](https://pic.yqqy.top/blog/20200516000510.png)

::: tip
在go1.7之前，context还是非编制的，存在（golang.org/x/net/context）中，golang团队发现context这个东西很好用，于是把它收编了，1.7版本正式进入了标准库。专门用来简化处理多个goroutine之间与请求域的数据、取消信号、截止时间等相关操作。
:::

对服务器传入的请求应该创建上下文，而对服务器的传出调用应该接受上下文，它们之间的函数调用链必须传递上下文，或者可以使用`WithCancel`、`WithDeadline`、`WithTimeOut`、`WithValue`创建的派生上下文，当一个上下文被取消时，它派生的所有上下文也被取消。

> Context常用的使用姿势

1. web编程中，一个请求对应多个goroutine之间的数据交互
2. 超时控制
3. 上下文控制

### context的底层结构

```go
type Context interface {
    Deadline() (deadline time.Time, ok bool)
    
    Done() <-chan struct{}
    
    Err() error
    
    Value(key interface{}) interface{}
}
```

|   字段   |                             含义                             |
| :------: | :----------------------------------------------------------: |
| Deadline | 返回一个time.Time，表示当前Context应该结束的时间，也就是完成工作的截止时间，ok则表示有结束时间 |
|   Done   | 当Context被取消或者超时时候返回的一个close的channel，告诉给context的相关的函数要停止当前工作然后返回 |
|   Err    | context被取消的原因，它只会在`Done`返回的Channel被关闭时才会返回非空的值 |
|  Value   | 从context中返回键对应的值，对于同一个上下文来说，多次调用`value`会传入相同的`key`会返回相同的结果，该方法仅用于传递跨API和进程间跟请求域的数据，context实现共享数据存储的地方，是线程安全的 |

### context的创建

为了更加方便的创建`Context`，包里头定义了`Background`来作为所有`Context`的根，可以认为所有的`Context`是树的结构，`Background`是树的根，当任一`Context`被取消的时候，那么继承他的`Context`将全部被回收。

### context的Api

#### WithCancel

`WithCancel`返回带有新Done通道的父节点的副本，当调用返回的`cancel`函数或当关闭 父上下文 的Done通道时，将关闭返回上下文的Done通道，无论先发生什么情况。

```go
func WithCancel(parent Context) (ctx Context, cancel CancelFunc)
```

练习场景：

在携程中依次循环计数，直到等于5的之后退出协程

```go
func main() {
	ctx, cancel := context.WithCancel(context.Background())
	// 当我们取完需要的整数后调用cancel
	defer cancel()
	
    // 从通道中读出
	for n := range gen(ctx) {
		fmt.Println(n)
		if n == 5 {
			break
		}
	}
}

func gen(ctx context.Context) <-chan int {
	dst := make(chan int)
	n := 1
	go func() {
		for {
			select {
            // 用context结束掉，其实就是读取到空的struct
			case <-ctx.Done():
				return // return结束该goroutine，防止泄露
			case dst <- n:
				n++
			}
		}
	}()
	return dst
}
```

**解释：** 在上面的示例代码中，`gen`函数在单独的goroutine中生成整数并将它们发送到返回的通道。 `gen`的调用者在使用生成的整数之后需要取消上下文，以免`gen`启动的内部goroutine发生泄漏。

#### WithDeadline

`WithDeadline`返回父上下文的副本，并将`deadline`调整为不迟于`d`。如果父上下文的`deadline`已经早于`d`，则`WithDeadline(parent, d)`在语义上等同于父上下文。当截止日过期时，当调用返回的`cancel`函数时，或者当父上下文的Done通道关闭时，返回上下文的Done通道将被关闭，以最先发生的情况为准。

```go
func WithDeadline(parent Context, d time.Time) (Context, CancelFunc) 
```

取消上下文将释放与其相关联的资源，因此代码还应该在此上下文中运行的操作完成后立即调用`cancel`

```go
func main() {
	d := time.Now().Add(time.Millisecond * 500)
	ctx, cancel := context.WithDeadline(context.Background(), d)

	defer cancel()

	select {
	case <-time.After(time.Second * 1):
		fmt.Println("overslept")
	case <-ctx.Done():
		fmt.Println(ctx.Err()) // context deadline exceeded
	}
}
```

上面的代码中，定义了一个50毫秒之后过期的`deadline`，然后我们调用`context.WithDeadline(context.Background(), d)`得到一个上下文`ctx`和一个取消函数`cancel`，然后使用一个`select`让主程序陷入等待，等待1秒后打印`overslept`退出或者等待`ctx`过期后退出，因为`ctx`50秒后就过期，所以`ctx.Done`会先接收到值，上面的代码会打印`ctx.Err()`取消原因

#### WithTimeout

`WithTimeout`返回`WithDeadLine(parent, time.Now().Add(timeout))`

```go
func WithTimeout(parent Context, timeout time.Duration) (Context, CancelFunc)
```

取消此上下文将释放与其相关的资源，因此代码应该在此上下文中运行的操作完成后立即调用`cancel`，通常用于数据库或者网络连接的超时控制

```go
var wg sync.WaitGroup

func main() {
	// 设置50毫秒的超时
	ctx, cancel := context.WithTimeout(context.Background(), time.Millisecond*50)
	defer cancel()

	wg.Add(1)
	go worker(ctx)
	time.Sleep(time.Second * 5)
	wg.Wait()
	fmt.Println("over")
}

func worker(ctx context.Context) {
LOOP:
	for {
		fmt.Println("db connecting ...")
		// 假设连接数据库耗时10毫秒
		time.Sleep(time.Millisecond * 10)
		select {
		case <-ctx.Done():
			break LOOP
		default:
		}
	}
	fmt.Println("worker done!")
	wg.Done()
}
```

上面示例代码就是设置了一个50毫秒的超时，在模拟链接超时到50毫秒的时候结束了操作

#### WithValue

`WithValue`函数能够将请求作用域的数据与Context对象建立关系

```go
func WithValue(parent Context, key, val interface{}) Context
```

`WithValue`返回父节点的副本，其中与`key`关联的值为`val`

仅对API和进程间传递请求域的数据使用上下文值，而不是使用它来传递可选参数给函数。

所提供的键必须是`可比较`的，并且不应该是`string`类型或任何其他内置类型，以避免使用上下文在包之间发生冲突。`WithValue`的用户应该为键定义自己的类型。为了避免在分配给interface{}时进行分配，上下文键通常具有具体类型`struct{}`，或者导出的上下文关键变量的静态类型应该为指针或接口。

```go
type TraceCode string

var wg sync.WaitGroup

func main() {
	ctx, cancel := context.WithTimeout(context.Background(), time.Millisecond*50)
	defer cancel()

	ctx = context.WithValue(ctx, TraceCode("TRACE_CODE"), "12512312234")
	wg.Add(1)
	go worker(ctx)
	time.Sleep(time.Second * 5)
	wg.Wait()
	fmt.Println("over")
}

func worker(ctx context.Context) {
	key := TraceCode("TRACE_CODE")
	// 在子goroutine中获取trace code
	traceCode, ok := ctx.Value(key).(string)
	if !ok {
		fmt.Println("invalid trace code")
	}

LOOP:
	for {
		fmt.Printf("worker, trace code:%s\n", traceCode)
		time.Sleep(time.Millisecond * 10) // 假设正常连接数据库耗时10毫秒
		select {
		case <-ctx.Done(): // 50毫秒后自动调用
			break LOOP
		default:
		}
	}
	fmt.Println("worker done!")
	wg.Done()
}
```

### 建议或注意事项

- 推荐以参数的方式传递context
- 如果是全链路函数，应该把context设置为第一个参数
- 给一个函数方法传递Context的时候，不要传递nil，如果不知道传递什么，就使用`context.TODO()`
- Context的Value相关方法应该传递请求域的必要数据，不应该用于传递可选参数
- Context是线程安全的，可以放心的在多个goroutine中传递

### 参考文章

* [Go标准库Context](https://www.liwenzhou.com/posts/Go/go_context/)
* [由浅入深聊聊Golang的context](https://blog.csdn.net/u011957758/article/details/82948750)