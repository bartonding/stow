
/**
 * 截取指定长度的字符串，如果指定的长度小于字符串总长度，则后面跟随省略号"..."
 * 注意：大于 U+0204 的 Unicode 都被视为汉字处理，目的是为了使得最后所得的字符串
 * 在 UA 上看起来尽量是等长的，目前在中英文环境下，勉强能满足需求
 *
 * @param  {String} str  目标字符串
 * @param  {Number} len  期望的字符长度，以英文字符计
 * @param  {Array} conf  一个布尔型的数组，用于配置 html、空格等的过滤，也方便后续扩展
 *                       ['是否过滤掉 html 标签', '是否压缩两个以上的空格']
 * @return {String}      返回截取后的字符串
 */
function stringEllipsis(str, len, conf) {
  // 前两个参数为必选
  if (!str || !len ) return '';

  conf || (conf = [1, 1]);

  conf[0] && (str = str.replace(/(<\w+?\s?.*?>)|(<\/\w+?>)/gi, ''));
  conf[1] && (str = str.replace(/\s\s+/g, ' '));

  var slen = str.length, i, s = 0;

  for (i = 0; i < slen; i++) {
    s++;
    // U+00FF(256) ASCII 外的都按汉字处理，在常规英文情况下，基本满足需求
    // 包含了扩展拉丁字母 U+0204(516)
    (str[i].charCodeAt() > 516) && s++;

    if (s >= len) {
      break;
    }
  }
  str = str.substring(0, i+1);
  // console.log(i, slen, s, str);

  return str + (slen > i ? '...' : '');
}