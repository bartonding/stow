// ua-scan.js
// ==========
// author: barton.ding@gmail.com
// time  : 2013-05-30
// src   : https://github.com/bartonding/stow/blob/master/ua-scan.js
// -----------------------------------------------------------------------------
// - 对 user-agent 字符串进行扫描，提取目标信息
// -
// - "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.31 (KHTML, like Gecko)
// -  Chrome/26.0.1410.64 Safari/537.31"
// -
// - 转化为如下 JSON 对象 ->
// -
// -    *     {
// -    *         'browser'  : ['Chrome', '26.0.1410.64'],
// -    *         'engine'   : ['WebKit', '537.31']
// -    *         'os'       : ['Windows NT', '6.1'],
// -    *         'isMobile' : false
// -    *     }
// -----------------------------------------------------------------------------
// - API's
// >>>>> attributes <<<<<
// -    UA.rules.browser
// -    UA.rules.engine
// -    UA.rules.os
// -    UA.rules.mobile
// >>>>>   methods  <<<<<
// -    UA.scan
// -    UA.addBrowserFilter
// -    UA.addEngineFilter
// -    [Deprecated]UA.scanBrowser
// -    [Deprecated]UA.scanEngine
// -    [Deprecated]UA.scanOS
// -    [Deprecated]UA.scanIsMobile

(function () {
    var root = this;

    var UA = function () {};

    // 参考自 underscore.js
    // Export the UA object for **Node.js**, with
    // backwards-compatibility for the old `require()` API. If we're in
    // the browser, add `_` as a global object via a string identifier,
    // for Closure Compiler "advanced" mode.
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = UA;
        }
        exports.UA = UA;
    } else {
        root.UA = UA;
    }

    // 参考自 underscore.js
    // 常用方法初始化
    (function (fns) {
        var _toString  = Object.prototype.toString;
        var i, len;
        for (i = 0, len = fns.length; i < len; i++) {
            UA['is' + fns[i]] = (function(name) {
                return function (obj) {
                    return _toString.call(obj) == '[object ' + name + ']'
                };
            })(fns[i]);
        }
    })(['Arguments', 'Function', 'String', 'Number', 'Date']);

    var rules = UA.rules = {};

    // 主流浏览器类型
    // 注意申明的顺序，对 UA 字符串进行扫描时，至上而下，一旦匹配则退出
    // 360SE，Maxthon等浏览器将更具其内核合并到对应的引擎/浏览器中
    // 原因是，此类浏览器大部分情况下，未在UA中提供其产商标识，导致无法识别
    var _browser = rules.browser = [
        'MSIE',
        'UCWEB',
        'UCBrowser',
        'Chrome',
        'Safari',
        'Firefox',
        'Opera',
        'Spider'
    ];

    // 主流操作系统
    // 注意申明的顺序，对 UA 字符串进行扫描时，至上而下，一旦匹配则退出
    var _os = rules.os = [
        'Windows NT',
        'Windows Phone [OS]{0,2}',

        'iPhone OS',
        'iPad',
        'Mac OS X',
        'IOS',

        'Symbian[OS]{0,2}',

        'Android',
        'Ubuntu',
        'Linux',

        // 当不能识别具体操作系统时，以对应品牌名替代，一般指手机品牌
        // todo：不是很全，后续视情况添加
        'BlackBerry',
        'Samsung',
        'Nokia',
        'GIONEE'
    ];

    // 主流浏览器引擎
    // 注意申明的顺序，对 UA 字符串进行扫描时，至上而下，一旦匹配则退出
    var _engine = rules.engine = [
        'WebKit',
        'Gecko',
        'Presto',
        'Trident'
    ];

    // 用于判断该 UA 是否为 mobile
    // 建议，仅当 _mobileBrowserString 和 _mobileOSString 的判定为 false 时
    // 采取的进一步判定
    var _mobile = rules.mobile = [
        'Mobile',
        'Lenovo[\\w\\d\\s-]+_TD',
        'ZTE[\\w\\d\\s-]+_TD',
        'LG-',
        'OPPO'
    ];

    // 列表中的浏览器，明确属于 mobile
    // 依赖于 rules.browser 的判定结果
    var _mobileBrowserString = [
        'UCWEB',
        'UCBrowser'
    ].join('-').toLowerCase();

    // 列表中的平台，明确属于 mobile
    // 依赖于 rules.os 的判定结果
    var _mobileOSString = [
        'Windows Phone OS',

        'iPhone OS',
        'iPad',

        'SymbianOS',

        'Android',

        'BlackBerry',
        'Samsung',
        'Nokia',
        'GIONEE'
    ].join('-').toLowerCase();

    // 根据 rules.browser，对单条 UA 进行扫描
    // return
    //   匹配   : [浏览器名，浏览器版本号||'-']
    //   无匹配 : null
    var _scanBrowser = UA.scanBrowser = function (ua) {
        var i, l, reg, matchs;
        var b = _browser;
        for (i = 0, l = b.length; i < l; i++) {
            reg = new RegExp('(' + b[i] + ')[\\/\\s]?([\\d\\.]+)?', 'i');
            matchs = ua.match(reg);
            if (matchs) {
                // return [matchs[1], matchs[2]||'-'];
                return _runFilter('browser',
                    matchs[1], ua, [matchs[1], matchs[2]||'-']);
            }
        }
        return null;
    };

    // 根据 rules.engine，对单条 UA 进行扫描
    // return
    //   匹配   : [引擎名，引擎本号||'-']
    //   无匹配 : null
    var _scanEngine = UA.scanEngine = function (ua) {
        var i, l, reg, matchs;
        var e = _engine;
        for (i = 0, l = e.length; i < l; i++) {
            reg = new RegExp('(' + e[i] + ')[\\/\\s]?([\\d\\.]+)', 'i');
            matchs = ua.match(reg);
            if (matchs) {
                // return [matchs[1], matchs[2]||'-'];
                return _runFilter('engine',
                    matchs[1], ua, [matchs[1], matchs[2]||'-']);
            }
        }
        return null;
    };

    // 根据 rules.os，对单条 UA 进行扫描
    // return
    //   匹配   : [OS名，OS号||'-']
    //   无匹配 : null
    var _scanOS = UA.scanOS = function (ua) {
        var i, l, reg, matchs;
        var os = _os;
        for (i = 0, l = os.length; i < l; i++) {
            reg = new RegExp('\\b(' + os[i] + ')[\\/\\s]?([\\d\\._]+)?', 'i');
            matchs = ua.match(reg);
            if (matchs) {
                return [matchs[1], matchs[2]||'-'];
            }
        }
        return null;
    };

    // 根据 rules.mobile，对单条 UA 进行扫描
    // 建议，仅当以下两种情况的判定为 false 时，采取的进一步判定
    //     1、_scanBrowser 的结果在 _mobileBrowserString 中的判断
    //     2、_scanOS 的结果在 _mobileOSString 中的判断
    // return
    //   匹配   : true
    //   无匹配 : false
    var _scanIsMobile = UA.scanIsMobile = function (ua) {
        var i, l, reg, matchs;
        var m = _mobile;
        for (i = 0, l = m.length; i < l; i++) {
            reg = new RegExp(m[i], 'i');
            matchs = ua.match(reg);
            if (matchs) {
                return true;
            }
        }
        return false;
    };

    var _checkMobileByOSAndBrowser = function (o){
        var ostr = _mobileOSString;
        var bstr = _mobileBrowserString;
        if ((o.os && ostr.indexOf((''+o.os[0]).toLowerCase()) !== -1)
            || (o.browser && bstr.indexOf((''+o.browser[0]).toLowerCase()) !== -1) ) {
            return true;
        }
        return false;
    };

    /**
     * 扫描给定数组中的 UA，每条 UA 记录转换为一个{对象}，结构如下：
     *     {
     *         'browser'  : ['browser name', 'browser version'],
     *         'engine'   : ['engine name', 'engine version']
     *         'os'       : ['os name', 'os version'],
     *         'isMobile' : true | false
     *     }
     * @param  {[Array]}   uas
     *     为 UA 字符串数组。如：['UA 1', 'UA 2', 'UA 3', ......]
     * @param  {Function} callback
     *     每条 UA 解析完毕后的回调
     * @return {[Array]}
     *     返回包含转换后的UA对象的数组
     */
    var _scan = UA.scan = function (uas, callback) {
        var hasCallback = UA.isFunction(callback);
        var results = [];
        var i = 0, len = uas.length, ua, obj;
        while (i < len) {
            ua = uas[i++];
            obj = {
                'browser': _scanBrowser(ua),
                'engine' : _scanEngine(ua),
                'os'     : _scanOS(ua)
            };
            obj.isMobile = _checkMobileByOSAndBrowser(obj);
            if (!obj.isMobile) {
                obj.isMobile = _scanIsMobile(ua);
            }
            results.push(obj);

            hasCallback && callback.apply(UA, [obj, ua, i-1]);
        };

        return results;
    };

    // -------------------------------------------------------------------------
    // 以下为自定义过滤器相关
    // -------------------------------------------------------------------------

    // 过滤器仓储
    var _filterStorage = {};

    // 过滤器初始化，目前仅支持两种 browser & engine 类型
    (function () {
        var initFilterStorage = function (type, obj) {
            // _filterStorage[type] = {};
            var ft = _filterStorage[type] = {};
            var i,len;
            for (i = 0, len = obj.length; i < len; i++) {
                ft[obj[i].toLowerCase()] = [];
            }
        };
        initFilterStorage('browser', _browser);
        initFilterStorage('engine', _engine);
    })();

    var _runFilter = function (type, name, ua, obj) {
        var ft = _filterStorage[type];
        name = name.toLowerCase();
        var fns = ft[name] || [];
        var i = 0, len = fns.length;
        var result = obj;
        while (i < len) {
            result = fns[i++](ua, result);
        }
        return result;
    };

    var _addFilter = function (type, name, fn) {
        if (!UA.isString(name) || !UA.isFunction(fn)) return;

        name = name.toLowerCase();

        var ft = _filterStorage[type];
        if (!ft[name]) return;

        ft[name].push(fn);
    };

    var _addBrowserFilter = UA.addBrowserFilter = function (browserName, fn) {
        _addFilter('browser', browserName, fn);
    };

    var _addEngineFilter = UA.addEngineFilter = function (engineName, fn) {
        _addFilter('engine', engineName, fn);
    };

    // -------------------------------------------------------------------------
    // -- 默认自定过滤器
    // -------------------------------------------------------------------------
    // browser = ['browser name', 'browser version'];
    _addBrowserFilter('safari', function (ua, browser) {
        var m = ua.match(/version\/([\d\.]+)/i);
        if (m) {
            browser[1] = m[1];
        }
        return browser;
    });
    _addBrowserFilter('opera', function (ua, browser) {
        var m = ua.match(/version\/([\d\.]+)/i);
        if (m) {
            browser[1] = m[1];
        }
        return browser;
    });

}).call(this);