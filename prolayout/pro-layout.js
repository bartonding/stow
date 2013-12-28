(function () {

    var root = this;

    var ProLayout = function () {};

    ProLayout.create = function (config) {
        return new Layout(config);
    };

    // Class Name Prefix
    var CNP = 'youdao-prolayout-';

    // -------------------------------------------------------------------------
    // -- Layout
    // -------------------------------------------------------------------------
    var DEFAULT_LAYOUT_CONFIG = {
        vgap   : 0,
        hgap   : 0,
        width  : '100%',
        height : '100%',
        scheme : [],
        // 布局方式，当 scheme 是一维数组时起作用
        // ['row', 'column']
        type   : 'row'
    };

    var Layout = window.Layout = function (conf) {
        this.conf = _.extend({}, DEFAULT_LAYOUT_CONFIG, conf || {});
        this.regions = {};
        this.init();
    };

    Layout.prototype = {
        init: function () {
            var self = this;
            var type = this.conf.type;
            var regions = this.regions;

            var wrap = this.container = generateDIV('wrap');
            var trRow = generateTR();
            var table = generateTABLE();

            var scheme = this._parseScheme();
            _.each(scheme, function (rconf, idx) {
                var region = new Region(rconf, self);
                regions[rconf.name] = region;
                if (type === 'row') {
                    trRow.append(region.render());
                } else {
                    table.append(generateTR().append(region.render()));
                }
            });
            if (type === 'row') table.append(trRow);

            wrap.append(table);
        },
        getRegion: function (regionName) {
            return this.regions[regionName];
        },
        addModules: function (mods, regionName) {
            var self = this;
            _.each(mods, function(mod, idx) {
                self.addModule(mod, regionName);
            });
        },
        addModule: function (mod, regionName) {
            var region = this.getRegion(regionName);
            region.addModule(mod);
        },
        layout: function () {
            $(document.body).prepend(this.container);
        },
        _parseScheme: function () {
            var scheme = this.conf.scheme;
            var result = [];
            _.each(scheme, function (region, idx) {
                // region 中嵌入 layout 实例
                if (region instanceof Layout || _.isObject(region)) {
                    result.push(region);
                }
                // 指定了 region 的配置参数
                // else if (_.isObject(region)) {
                //     result.push(region);
                // }
                // 仅指定了 region 名称
                else if (_.isString(region)) {
                    result.push({'name': region});
                }
            });
            this.conf.scheme = result;
            return result;
        }
    };

    // -------------------------------------------------------------------------
    // -- Region
    // -------------------------------------------------------------------------
    var DEFAULT_REGION_CONFIG = {
        //
        // ['fixed', 'min', 'max']
        type: 'min',
        width: '100%',
        height : '100%',
        // region 垂直方向上的对齐方式，应用于<td>元素
        // 每个 region 可单独设置
        valign : 'top'
    };

    var Region = function (conf, layout) {
        this.conf = _.extend({}, DEFAULT_REGION_CONFIG, conf || {});
        this.layout = layout;
        this.mods = [];
        this.init();
    };
    Region.prototype = {
        init: function () {
            this.eWrap = generateTD(this.conf.valign);
            this.eContent = generateDIV('region');
            // this.eContent.html(this.conf.name);
            this.eWrap.append(this.eContent);
        },
        addModules: function (mods) {
            var self = this;
            _.each(mods || [], function (mod, idx) {
                self.addModule(mod);
            });
        },
        addModule: function (mod) {
            this.eContent.append(mod.render());
        },
        render: function () {
            return this.eWrap;
        }
    };

    // -------------------------------------------------------------------------
    function generateDIV(className) {
        return $('<div class="' + CNP + className + '">');
    }
    function generateTD(va) {
        return $([
            '<td class="' + CNP + 'td" ',
                'style="vertical-align:' + va + ';" ',
            '>'
        ].join(''));
    }
    function generateTR() {
        return $('<tr class="' + CNP + 'tr">');
    }
    function generateTABLE() {
        return $([
            '<table class="' + CNP + 'table" ',
                'style="width:100%;height:100%;border-collapse:collapse;" ',
                'border="0" cellpadding="0" cellspacing="0" ',
            '>'
        ].join(''));
    }

    // -------------------------------------------------------------------------
    // 参考自 underscore.js
    // Export the UA object for **Node.js**, with
    // backwards-compatibility for the old `require()` API. If we're in
    // the browser, add `_` as a global object via a string identifier,
    // for Closure Compiler "advanced" mode.
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = ProLayout;
        }
        exports.ProLayout = ProLayout;
    } else { root.ProLayout = ProLayout; }

}).call(this);