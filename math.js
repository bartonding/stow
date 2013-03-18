// -----------------------------------------------------------------------------
// -- 纯数学计算相关
// -----------------------------------------------------------------------------
(function () {

var root = this;

if (root.iMath) return;

var iMath = root.iMath = {};

// 指定范围的随机整数
iMath.random = function (min, max) {
    return (Math.random() * (max - min) + min) | 0;
};

/**
 * 使得 [start, end] 出现在 [min, max] 中的概率为 rate
 * @param  {Number} min    随机数范围的开始数字
 * @param  {Number} max    随机数范围结束数字
 * @param  {Number} start  要随机的数字的开始数字
 * @param  {Number} end    要随机的数字的结束数字
 * @param  {Number} rate   随机概率，取值范围 [0, 1)
 *                         指[start, end]出现在[min, max]中的概率
 * @return {Number} 随机值
 */
iMath.randomRegion = function (min, max, start, end, rate) {
    var randomLen = end - start;
    var len = max - min;
    var increased, result;
    if (randomLen / len == rate) {
        return iMath.random(min, max);
    } else {
        increased = (rate * len - randomLen) / (1 - rate);
        // 缩放回原来区间
        result = iMath.random(min, max + increased);
        if (min <= result && result <= start) {
            return result;
        } else if (start <= result && result <= (end + increased)) {
            return start
                + (result - start) * randomLen / (randomLen + increased);
        } else if ((end + increased) <= result && result <= (max + increased)) {
            return result - increased;
        }
    }
};

}).call(this);