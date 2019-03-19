// 质数（prime number）又称素数，有无限个。 质数定义为在大于1的自然数中，
// 除了1和它本身以外不再有其他因数。
// 
// 关键在于 limit 的取值，为什么是平方根
//    假设存在 x 和 y 两个数，他们的乘积 x * y = n ，
//    那么 x 或者 y 必有一个小于等于 n 的平方根

function isPrime(n)
{
  var divisor = 3;
  var limit = Math.sqrt(n);
  
  //check simple cases
  if (n == 2 || n == 3) return true;
  if (n % 2 == 0) return false;

  while (divisor <= limit)
  {
    if (n % divisor == 0) {
      return false;
    } else {
      // 偶数的情况在上面 n % 2 == 0 已经考虑过了
      divisor += 2;
    }
  }
  return true;
}
isPrime(137); // = true
isPrime(237); // = false