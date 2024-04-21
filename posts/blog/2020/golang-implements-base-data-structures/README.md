---
title: "Golang实现几种基本数据结构"
description: "复习数据结构，使用Golang写一下"
date: 2020-03-31 15:53:11
categories: ["后端"]
tags: ["Golang"]
---

# Golang实现几种基本数据结构

## 排序

### 选择排序

每次选择数据中最小的数放在开头，这样经过若干个步骤，就排完了整个数组。

**算法思想** 

- 贪心算法：每一次决策只看当前，当前最优则全局最优。(不是任何时候都适用)

- 减治思想：外层循环每一次都能排定一个元素，问题的规模逐渐减少，直到全部解决，即「大而化小，小而化了」。

**优点**

交换次数最少

**复杂度分析**

- 时间复杂度：*O*(N²)，这里N是数组的长度
- 空间复杂度：*O*(1)，使用到常数个临时变量

```go
func selectionSort(arr []int) []int {
	var min = 0

	for i := 0; i < len(arr); i++ {
		min = i
		for j := i+1; j < len(arr); j++ {
			if arr[j] < arr[min] {
				min = j
			}
		}

		arr[i], arr[min] = arr[min], arr[i]
	}
	return arr
}
```



### 冒泡排序

外层循环每一次经过两两比较，把每一轮未排定部分最大的元素放到了数组的末尾；

**特点**：

在遍历的过程中，提前检测到数组是有序的，从而结束排序，而不像「选择排序」那样，即使输入数据是有序的，「选择排序」依然需要「傻乎乎」地走完所有的流程。

**复杂度分析**：

- 时间复杂度：*O*(N²)，这里 N 是数组的长度；
- 空间复杂度：*O*(1)，使用到常数个临时变量。

```go
func bubbleSort(arr []int) []int {
	for i := len(arr); i >= 0; i-- {
		// 用bool标记是否已经有序，减少时间空间
		isSorted := false
		for j := 0; j < i; j++ {
			if j+1 < len(arr) && arr[j] > arr[j+1] {
				arr[j], arr[j+1] = arr[j+1], arr[j]
				isSorted = false
			}
		}
		if isSorted {
			break
		}
	}
	return arr
}
```



### 计数排序

计数排序是非比较排序，其适用于一定范围内的整数排序。在取值范围不是很大的情况下，它的性能甚至快过那些时间复杂度`O(nlogn)`的排序。

**局限性**

1. 当数列最大和最小值差距过大时，并不适合用计数排序。
2. 当数列元素不是整数时，也不适合用计数排序

**初版**

1. 得到数列的最大值
2. 根据最大值确定数组长度
3. 遍历数列，填充统计数组
4. 遍历统计数组，输出结果

```go
func countSort(arr []int) []int {
	// 1. 得到数列的最大值
	max := arr[0]
	for i := 1; i < len(arr); i++ {
		if arr[i] > max {
			max = arr[i]
		}
	}

	// 2. 根据最大值确定数组长度
	countArray := make([]int, max+1)

	// 3. 遍历数列，填充统计数组
	for i := 0; i < len(arr); i++ {
		countArray[arr[i]]++
	}

	// 4. 遍历统计数组，输出结果
	sortedArray := make([]int, 0, len(arr))
	for i := 0; i < len(countArray); i++ {
		for j := 0; j < countArray[i]; j++ {
			sortedArray = append(sortedArray, i)
		}
	}
	return sortedArray
}
```

**优化版**

上面的算法并不是严谨，会浪费掉很多空间，比如数字是 `90, 91, 95, 99, 93`，那么最大的数字是99，会申请100个空间，但是前面`0~89`的空间就浪费了。

- 最大值-最小值=范围
- 逆序排列便于排名

```go
func countSort(arr []int) []int {
	// 1. 得到数列的最大值和最小值，并计算差值d
	max, min := arr[0], arr[0]
	for i := 1; i < len(arr); i++ {
		if arr[i] > max {
			max = arr[i]
		}
		if arr[i] < min {
			min = arr[i]
		}
	}
	d := max - min

	// 2. 创建统计数组并统计对应元素的个数
	countArray := make([]int, d+1)
	for i := 0; i < len(arr); i++ {
		countArray[arr[i]-min]++
	}

	// 3. 统计数组做变量，后面的元素等于前面的元素之和
	for i := 1; i < len(countArray); i++ {
		countArray[i] += countArray[i-1]
	}

	// 4. 倒序遍历原始数列，从统计数组找到正确位置，输出到结果数组
	sortedArray := make([]int, len(arr))
	for i := len(arr)-1; i >= 0; i-- {
		sortedArray[countArray[arr[i]-min]-1] = arr[i]
		countArray[arr[i]-min]--
	}
	return sortedArray
}
```



### 桶排序

桶排序是非比较排序，通过将元素划分到不同的区段，实现区段内排序进行操作

**优点**

- 将数据分到指定的桶，可以单独对桶内数据处理

**缺点**

- 如果数据分布不均匀，可能要浪费掉很多的空间，

```go
func bucketSort(arr []float64) []float64 {
	// 1. 得到数列的最大值和最小值，并计算差值d
	max, min := arr[0], arr[0]
	for i := 1; i < len(arr); i++ {
		if arr[i] > max {
			max = arr[i]
		}
		if arr[i] < min {
			min = arr[i]
		}
	}

	// 2. 初始化桶
	// 桶的大小
	bucketSize := len(arr)
	// 桶的个数
	bucketCount := int(max-min)/bucketSize + 1
	sortedArray := make([][]float64, bucketCount)
	for i := 0; i < bucketCount; i++ {
		sortedArray[i] = make([]float64, 0)
	}

	// 3. 将数据送入各自的桶
	for _, val := range arr {
		idx := int(val-min) / bucketSize
		sortedArray[idx] = append(sortedArray[idx], val)
	}

	// 4. 每个桶内进行排序
	sorted := make([]float64, 0)
	for _, bucket := range sortedArray {
		if len(bucket) > 0 {
			// 插入排序
			insertionSort(bucket)
			sorted = append(sorted, bucket...)
		}
	}

	return sorted
}

func insertionSort(arr []float64) {
	for k, v := range arr {
		temp := v
		j := k - 1
		for ; j >= 0 && arr[j] > temp; j-- {
			arr[j+1] = arr[j]
		}
		arr[j+1] = temp
	}
}
```



## Stack

栈是具有有限容量的抽象数据类型，是一种`LIFO(后进先出)`数据结构。

```go
package main

import "fmt"

type Stack struct {
	Size int
	Top  *Node
}

type Node struct {
	Val  string
	Next *Node
}

func (s *Stack) Len() int {
	return s.Size
}

func (s *Stack) Push(val string) {
	s.Top = &Node{val, s.Top}
	fmt.Printf("%v pushed to stack\n", val)
	s.Size++
}

func (s *Stack) Pop() (val string) {
	if s.Size > 0 {
		val, s.Top = s.Top.Val, s.Top.Next
		s.Size--
		return
	}
	return
}

func main() {
	stack := &Stack{}
	stack.Push("10")
	stack.Push("20")
	stack.Push("30")

	for stack.Len() > 0 {
		fmt.Printf("%v poped from stack\n", stack.Pop())
	}
}
```



## Queue

队列是一种抽象数据类型或线性数据结构，是`FIFO(先进先出)`数据结构。

```go
package main

import "fmt"

type Queue struct {
	Size  int
	Front *Node
}

type Node struct {
	Val  string
	Next *Node
}

// len
func (q *Queue) Length() int {
	return q.Size
}

// enqueue
func (q *Queue) Enqueue(val string) {
	if q.Front == nil {
		q.Front = &Node{val, nil}
	} else {
		rear := q.Front
		for rear.Next != nil {
			rear = rear.Next
		}
		rear.Next = &Node{val, nil}
	}
	fmt.Printf("%v enqueued to queue\n", val)
	q.Size++
}

// dequeue
func (q *Queue) Dequeue() (val string) {
	if q.Size > 0 {
		val, q.Front = q.Front.Val, q.Front.Next
		q.Size--
		return
	}
	return
}

func main() {
	queue := &Queue{}

	queue.Enqueue("10")
	queue.Enqueue("20")
	queue.Enqueue("30")

	for queue.Length() > 0 {
		fmt.Printf("%s poped from queue\n", queue.Dequeue())
	}
}
```



## Linked List

练习了以下4个方法，对于链表平时刷题推荐用 `container/list` 这个包，很好用

- pushFront 从头push
- pushBack  从尾push
- popFront   从头pop
- popBack    从尾pop

```go
type Node struct {
	Val  int
	Next *Node
}

// head 默认值
var head *Node = nil

// pushFront
func (n *Node) pushFront(val int) *Node {
	if head == nil {
		n.Val = val
		n.Next = nil
		head = n
		return n
	} else {
		// 分配新内存空间
		newNode := new(Node)
		newNode = head
		tmpNode := &Node{
			Val:  val,
			Next: newNode,
		}
		head = tmpNode
		return head
	}
}

func (n *Node) pushBack(val int) *Node {
	if head == nil {
		n.Val = val
		n.Next = nil
		head = n
		return n
	} else {
		// 从链表中读取所有节点
		for n.Next != nil {
			n = n.Next
		}
		// 分配新内存空间
		n.Next = new(Node)
		n.Next.Val = val
		n.Next.Next = nil
		return n
	}
}

// popfront
func (n *Node) popFront() *Node {
	if head == nil {
		return head
	}
	newNode := new(Node)
	newNode = head.Next
	head = newNode
	return head
}

// popback
func (n *Node) popBack() *Node {
	if head == nil {
		return head
	}
	newNode := new(Node)
	newNode = head
	for newNode.Next.Next != nil {
		newNode = newNode.Next
	}
	newNode.Next = nil
	return head
}
```

