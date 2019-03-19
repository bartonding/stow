
    // let len = 0;
    // let rrr = fourSum([1,2,3,4,5,6,7,8,9], 7);
    // console.log(rrr)

    // function fourSum(nums, target) {
    //     len = nums.length;
    //     nums.sort(); // 先排序
    //     return kSum(nums, target, 4, 0); // 递归调用
    // }

// console.log(JSON.stringify(kSum([1,2,3,4,5,6,7,8,9], 7, 2, 0), null, 2))
// console.log(kSum([1,2,3, 3,4,5,6], 10, 3, 0))
let testarr = [1,2,4,2,2,3,4,5,6,7,8,9]
// console.log(kSum([1,2,2,2,3,4,5,6,7,8,9], 10, 3, 0))
console.log(kSum([...new Set(testarr)].sort(), 10,3,0))

function kSum(nums, target, k, index) {

  let res = [], len = nums.length;

  if (index >= len) return res;

  if (k == 2) { // 两数取和
    let i = index, j = len - 1;
    while (i < j) {
      if (target - nums[i] == nums[j]) {
        res.push([nums[i], nums[j]]);
        // while (i < j && nums[i] == nums[i + 1]) i++;
        // while (i < j && nums[j] == nums[j - 1]) j--;
        i++;
        j--;
      } 
      else if (target - nums[i] > nums[j]) i++;
      else j--;
    }
  } else {
    for (let i = index; i < len - k + 1; i++) {
      // 调用递归 DFS
      let temp = kSum(nums, target - nums[i], k - 1, i + 1);
      // 若是有值返回则将该数塞入，无则不进行任何操作
      if (temp != null && temp.length > 0) {
        temp.forEach(a => a.unshift(nums[i]));
        res.push(...temp);
      }
      // while (i < len - 1 && nums[i] == nums[i + 1]) i++;
    }
  }
  // console.log('> ', target, k, index, res)
  return res;
}


