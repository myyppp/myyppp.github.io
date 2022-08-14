# Go ACM 模式下的输入输出

## 用 fmt 包实现简单读取

```
链接：https://ac.nowcoder.com/acm/contest/5657/E
来源：牛客网

输入的第一行包括一个正整数t(1 <= t <= 100), 表示数据组数。
接下来t行, 每行一组数据。
每行的第一个整数为整数的个数n(1 <= n <= 100)。
接下来n个正整数, 即需要求和的每个正整数。
```

```go
package main

import "fmt"

func main() {
	var t int
	fmt.Scan(&t)
	for i := 0; i < t; i++ {
		var cnt int
		fmt.Scan(&cnt)
		nums := make([]int, cnt)
		for k := range nums {
			fmt.Scan(&nums[k])
		}
		var sum int
		for _, v := range nums {
			sum += v
		}
		fmt.Println(sum)
	}
}
```

## 整行读取

```
多个测试用例，每个测试用例一行。
每行通过,隔开，有n个字符，n＜100
```

```go
package main

import (
	"bufio"
	"fmt"
	"os"
	"sort"
	"strings"
)

func main() {
	in := bufio.NewScanner(os.Stdin)
	for in.Scan() {
		strs := strings.Split(in.Text(), ",")
		sort.Strings(strs)
		fmt.Println(strings.Join(strs, ","))
	}
}
```
