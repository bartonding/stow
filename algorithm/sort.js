// Insert Sort 
// 假设第一个数已经有序，我们排的是升序，从第二个数起，如果前边的数大于第二个数， 
// 那么就把第一个数挪到第二个数这里，再把第二个数放到第一个数，这样有序区间就变成两个。
// 依次排序直到有序区间为数组的长度，那么排序完成。
function insertSort(arr) {
  // console.log('> ', arr.join(', '))
  let i, end, tem;
  for (i = 0, len = arr.length; i < len - 1; i++) {
    end = i;
    tem = arr[end + 1];
    for (; end >= 0; end--) {
      if (tem < arr[end]) {
        arr[end + 1] = arr[end];
      } else {
        break;
      }
      // console.log(`  `, arr.join(', '), `[${tem}]`)
    }
    arr[end + 1] = tem;
    console.log(`> `, arr.join(', '))
  }
}
// insertSort([9, 5, 4, 2, 3, 6, 8, 7, 1, 0])

// -----------------------------------------------------------------------------
// 快排
const quickSort = (array) => {
  const sort = (arr, left = 0, right = arr.length - 1) => {
    if (left >= right) { // 如果左边的索引大于等于右边的索引说明整理完毕
      return
    }
    let i = left
    let j = right
    const baseVal = arr[j] // 取无序数组最后一个数为基准值
    while (i < j) { // 把所有比基准值小的数放在左边大的数放在右边
      while (i < j && arr[i] <= baseVal) { // 找到一个比基准值大的数交换
        i++
      }
      arr[j] = arr[i] // 将较大的值放在右边如果没有比基准值大的数就是将自己赋值给自己（i 等于 j）
      while (j > i && arr[j] >= baseVal) { // 找到一个比基准值小的数交换
        j--
      }
      arr[i] = arr[j] // 将较小的值放在左边如果没有找到比基准值小的数就是将自己赋值给自己（i 等于 j）
    }
    arr[j] = baseVal // 将基准值放至中央位置完成一次循环（这时候 j 等于 i ）
    sort(arr, left, j-1) // 将左边的无序数组重复上面的操作
    sort(arr, j+1, right) // 将右边的无序数组重复上面的操作
  }
  const newArr = array.concat() // 为了保证这个函数是纯函数拷贝一次数组
  sort(newArr)
  return newArr
}