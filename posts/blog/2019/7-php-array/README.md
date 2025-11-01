---
title: "php多维数组降维记载"
description: "php多维数组降维记载"
date: 2019-08-20 07:47:23
tags: ["PHP"]
---

# php多维数组降维记载

### 多维数组降一维数组

```php
/**
* 多维数组变成一维数组
* @param $array
* @param array $return
* @return array
*/
public function arr_foreach($array,$return=[])
{
	array_walk_recursive($array,function($value) use (&$return) {
	$return[]=$value;
	});
	return $return;
}
```

调用方式 `$this->arr_foreach(多维数组)`

### 三维数组降二维数组

```php
/**
* 三维数组转二维数组
* @param $array
* @return array
*/
public function array3_to_array2($array) {
	$array = array_filter($array);
	$array = array_values($array);
	foreach ($array as $k =>$v) {
		$count = count($v);
		if ($count > 1) {
			for ($i = 0;$i < $count;$i++) {
				$resArr[] = $v[$i];
			}
		} else {
			$resArr[] = $v[0];
		}
	}
	return $resArr;
}
```

调用方式 `$this->array3_to_array2(三维数组)`