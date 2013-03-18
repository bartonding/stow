// -----------------------------------------------------------------------------
// -- 与坐标系/位置相关的计算
// -----------------------------------------------------------------------------
(function () {

var root = this;

if (root.CoordFrame) return;

var CF = root.CoordFrame = {};

// 计算两点直线距离
// Straight-Line Distance
CF.slineDistance = function (x1, y1, x2, y2) {
    var x = Math.abs(x1 - x2);
    var y = Math.abs(y1 - y2);
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
};

// 计算地球上俩经纬坐标点之间的距离
// 经度 - longitude, 纬度 - latitude
// 参考 google maps
// 还未测试
var EARTH_RADIUS = 6378.137; // 赤道半径，单位 km | 公里
var _rad = function (d) { return d * Math.PI / 180.0; };
CF.earthDistance = function (lat1, lng1, lat2, lng2) {
    var radLat1 = _rad(lat1);
    var radLat2 = _rad(lat2);
    var a = radLat1 - radLat2;
    var b = _rad(lng1) - _rad(lng2);
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2), 2)
        + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b/2), 2)));
    s = s * EARTH_RADIUS;
    s = Math.Round(s * 10000) / 10000;
    return s;
};

/**
 * 使得子元素在父容器中居中对齐，方式为绝对定位
 * 如果子元素size大于容器时，子元素将等比缩放
 * @param  {Number} pw Parent Width 容器宽度
 * @param  {Number} ph Parent Height 容器高度
 * @param  {Number} cw Child Width 子元素宽度
 * @param  {Number} ch Child Height 子元素高度
 * @return {Object}    返回可是子元素居中的{width，height，top，left}
 */
CE.center = function (pw, ph, cw, ch) {

    var c = {'w': cw, 'h': ch};
    var p = {'w': pw, 'h': ph};

    var a, b, r;

    if (c.w > p.w || c.h > p.h) {
        a = (c.w - p.w) > (c.h - p.h) ? 'w' : 'h';
        b = a === 'w' ? 'h' : 'w';
        r = c[b] / c[a];
        c[a] = p[a];
        c[b] = c[a] * r;
        if (c[b] > p[b]) {
            c[b] = p[b];
            c[a] = (1/r) * c[b];
        }
    }

    return {
        'width': c.w,
        'height': c.h,
        'top': (p.h - c.h) / 2,
        'left': (p.w - c.w) / 2
    };
};

/**
 * 限定一个元素在指定的容器内，返回修正后的坐标值
 * 以容器左上角为坐标系原点，右为 X 轴正方向，下为 Y 轴正方向
 *
 * @param  {Number} pw Parent Width 容器宽度
 * @param  {Number} ph Parent Height 容器高度
 * @param  {Number} cw Child Width 子元素宽度
 * @param  {Number} ch Child Height 子元素高度
 * @param  {Number} cx Child X 轴值
 * @param  {Number} cy Child Y 轴值
 * @return {Object}    返回修正后的坐标值 {x: n, y: m}
 */
CF.holdChild = function (pw, ph, cw, ch, cx, cy) {

    // 容器与子元素的 size 差
    var _h = ph - ch;
    var _w = pw - cw;

    // ----------------------------------------
    // 修正 y 轴坐标值
    var y  = cy;
    // 子元素高度小于容器
    if (_h >= 0) {
        y = (y <= 0) ? 0 : (y >= _h) ? _h : y;
    }
    // 子元素高度大于父容器
    else {
        y = (y >= 0) ? 0 : (y <= _h) ? _h : y;
    }
    // ----------------------------------------
    // 修正 x 轴坐标值
    var x = cx;
    // 子元素宽度度小于容器
    if (_w >= 0) {
        x = (x <= 0) ? 0 : (x >= _w) ? _w : x;
    }
    // 子元素宽度度大于容器
    else {
        x = (x >= 0) ? 0 : (x <= _w) ? _w : x;
    }

    return {'x': x, 'y': y};
};

}).call(this);