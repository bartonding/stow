// 斐波那契数列（Fibonacci sequence），又称黄金分割数列、因数学家列昂纳多·斐波那契
// （Leonardoda Fibonacci）以兔子繁殖为例子而引入，故又称为“兔子数列”，指的是这样一个
// 数列：1、1、2、3、5、8、13、21、34、……在数学上，斐波纳契数列以如下被以递推的方法定
// 义：F(1)=1，F(2)=1, F(n)=F(n-1)+F(n-2)（n>=3，n∈N*）在现代物理、准晶体结构、化学
// 等领域，斐波纳契数列都有直接的应用，为此，美国数学会从1963年起出版了以《斐波纳契数列
// 季刊》为名的一份数学杂志，用于专门刊载这方面的研究成果。

// 方法1：直接。时间复杂度 O(n)
function fibonacci(n){
  var fibo = [0, 1];
  if (n <= 2) return 1;
  for (var i = 2; i <=n; i++ ){
    fibo[i] = fibo[i-1]+fibo[i-2];
  }
  return fibo[n];
} 
fibonacci(12); //  = 144

// 方法二：递归。时间复杂度 O(2^n)
function fibonacci(n) {
  if(n <= 1) {
    return n;
  }
  return fibonacci(n-1) + fibonacci(n-2);
}
fibonacci(12); //  = 144