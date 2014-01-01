(function () {

    var root = this;

    var FlexLayout = function () {};

    // 保持当前页面中的所有 layout 实例
    var layoutCache = FlexLayout.layoutCache = {};

    FlexLayout.create = function (config) {
        var layout = new Layout(config);
        layoutCache[layout.name] = layout;
        return layout;
    };

    // -------------------------------------------------------------------------
    // -- 生产全局 ID
    var _layout_id = 0;
    function generateLayoutId () {
        return 'youdao_flexlayout_' + (_layout_id++);
    }
    var _region_id = 0;
    function generateRegionId (layoutName) {
        return layoutName + '_' + (_region_id++);
    }

    // -------------------------------------------------------------------------
    // -- custom event
    var ievent = (function () {
        var slice = Array.prototype.slice;
        var callbacks = {};
        var splitEventString = function (str) {
            return str.replace(/^\s+/,'').replace(/\s+$/,'').split(/\s+/);
        };
        var iEvent = {
            on: function (etype, fn) {
                if (!callbacks[etype]) {
                    callbacks[etype] = [];
                }
                callbacks[etype].push(fn);
            },
            trigger: function () {
                if (arguments.length === 0) return;
                var events = splitEventString(arguments[0]);
                var args = slice.call(arguments, 1);
                _.each(events, function (etype) {
                    _.each(callbacks[etype] || [], function (fn) {
                        window.setTimeout(function () {
                            fn.apply(null, args);
                        }, 1);
                    });
                });
            }
        };
        return iEvent;
    })();
    // 把自定义事件挂到 FlexLayout 上, 共外部使用
    FlexLayout.on = ievent.on;
    FlexLayout.trigger = ievent.trigger;

    // -------------------------------------------------------------------------
    // -- window resize 的处理
    function layoutResize (evt) {
        console.log('layout resize ......');
        var w = $(window).width();
        var h = $(window).height();
        _.each(layoutCache, function(layout, layoutName) {
            if (layout.isSubLayout) return;
            ievent.trigger(layoutName, {width: w, height: h}, layoutName);
        });
    }
    $(window).resize(_.debounce(layoutResize, 100));

    // -------------------------------------------------------------------------
    // -- Layout
    // -------------------------------------------------------------------------
    var DEFAULT_LAYOUT_CONFIG = {
        // region 之间的距离
        // vgap   : 0,
        // hgap   : 0,
        width  : '100%',
        height : '100%',
        // 配置 region 参数
        scheme : [],
        // 布局方式：row - 水平，column - 垂直
        type   : 'row'
    };

    var Layout = function (conf) {
        this.name = generateLayoutId();
        this.isSubLayout = false; // 默认为非嵌套layout
        this.conf = _.extend({}, DEFAULT_LAYOUT_CONFIG, conf || {});
        this.regions = {};
        this.regionIndex = [];
        this.init();
    };

    Layout.prototype = {
        init: function () {
            // layout 容器
            this.wrap = generateDIV('wrap');
            this.wrap.attr('id', this.name);

            this.isRow = this.conf.type === 'row';

            this.initLayoutContainer();

            ievent.on(this.name, _.bind(this.layoutResize, this));
        },
        initLayoutContainer: function () {
            // 初始化容器样式
            this.wrap.css({
                'width'  : this.conf.width,
                'height' : this.conf.height
            });

            var self = this;
            var regions = this.regions;
            var regionIndex = this.regionIndex;

            var trRow = generateTR();
            var table = generateTABLE();

            // 创建 region 实例
            _.each(this._parseScheme(), function (rconf, idx) {
                var region = new Region(rconf, self);
                regions[rconf.name] = region;
                regionIndex.push(rconf.name);

                if (self.isRow) {
                    trRow.append(region.render());
                } else {
                    table.append(generateTR().append(region.render()));
                }
            });

            if (self.isRow) table.append(trRow);

            this.wrap.append(table);
        },
        // ws = Window Size = {width, height};
        layoutResize: function (ws, evtName) {
            console.log('at layout ', evtName);
            _.each(this.regions, function (region, regionName) {
                if (region.conf.type === 'max') {
                    ievent.trigger(region.name, ws, region.name);
                }
            });
        },
        getRegion: function (regionName) {
            return this.regions[regionName];
        },
        // 动态添加 region 到指定位置
        addRegion: function (regionConf, position) {
            if (regionConf instanceof Region) return null;
            var tmpRegion, ri = this.regionIndex, len = ri.length;
            var p = position === undefined ? -1 : position;
            if (_.isString(p)) {
                tmpRegion = this.getRegion(p);
                p = _.indexOf(ri, p) + 1;
            } else if (_.isNumber(p)) {
                p = p === 0 ? 1 : p > 0 ? p : (p + len) < 0 ? len : p + len + 1;
                tmpRegion = this.getRegion(ri[p-1]);
            }

            if (!tmpRegion) return null;

            var conf = this._mendRegionConfig(regionConf);
            var region = new Region(conf, this);
            this.regions[region.name] = region;
            ri.splice(p, 0, region.name)；

            if (this.isRow) {

            }

            return region;
        },
        addModules: function (mods, regionName) {
            var self = this;
            _.each(mods, function(mod, idx) {
                self.addModule(mod, regionName);
            });
        },
        addModule: function (mod, regionName) {
            var region = this.getRegion(regionName);
            // 如果指定了不存在的 region，则不处理，容错
            region && region.addModule(mod);
        },
        layout: function (node) {
            var node = $(node);
            if (node.length === 0) node = $(document.body);
            // node.prepend(this.wrap);
            node.prepend(this.wrap);
        },
        _mendRegionConfig: function (region) {
            if (_.isObject(region)) return region;
            if (_.isString(region)) return {'name': region};
            return null;
        },
        _parseScheme: function () {
            var result = [], self = this, hasMaxType = false;
            _.each(this.conf.scheme, function (region, idx) {

                region = self._mendRegionConfig(region);

                // region 中嵌入 layout 实例或为 null 时, 忽略之
                if (region === null || region instanceof Layout) return;


                // 指定了 region 的配置参数
                result.push(region);

                if (!hasMaxType && region.type === 'max') {
                    hasMaxType = true;
                    return;
                }

                // 避免出现多个 region.conf.type='max' 的情况
                if (hasMaxType && region.type === 'max') {
                    region.type = 'min';
                }
            });

            // 确保每个layout中至少包含一个 type='max' 类型
            // 默认为最后一个 region
            if (!hasMaxType && result.length > 0) {
                result[result.length - 1].type = 'max';
            }

            this.conf.scheme = result;

            return result;
        }
    };

    // -------------------------------------------------------------------------
    // -- Region
    // -------------------------------------------------------------------------
    var DEFAULT_REGION_CONFIG = {
        // ['fixed', 'min', 'max']
        type: 'fixed',
        size: 0
    };

    var Region = function (conf, layout) {
        var cf = this.conf = _.extend({}, DEFAULT_REGION_CONFIG, conf || {});

        var size = parseInt(cf.size, 10);
        cf.size = _.isNaN(size) ? 0 : size;
        if (cf.size === 0 && cf.type === 'fixed') cf.type = 'min';

        this.name = generateRegionId(layout.name);
        this.layout = layout;
        this.mods = [];
        this.init();
    };

    Region.prototype = {
        init: function () {
            var conf = this.conf;
            var layout = this.layout;

            this.wrap = generateTD();
            this.context = generateDIV('region');
            this.context.attr('id', this.name);
            this.wrap.append(this.context);

            // 初始化 region 样式
            var attrName = layout.isRow ? 'width' : 'height';
            var type = conf.type;
            if (type === 'max') {
                this.wrap.css(attrName, '100%');
                this.context.css(attrName, '100%');
            } else if (type === 'fixed') {
                this.context.css(attrName, conf.size);
            }

            if (layout.isRow) {
                this.context.css('height', layout.conf.height);
            }

            ievent.on(this.name, _.bind(this.regionResize, this));
        },
        // ws = Window Size = {width, height};
        regionResize: function (ws, evtName) {
            console.log('at region ', evtName);
            var self = this;
            var ctx = this.context;
            _.each(this.mods, function (mod, idx) {
                if (mod instanceof Layout) {
                    ievent.trigger(mod.name, ws, mod.name);
                } else {
                    _.isFunction(mod._layoutResize) && mod._layoutResize(
                        {width: ctx.width(), height: ctx.height()},
                        ws, self.context
                    );
                }
            });
        },
        // region 中的module可主动调用该方法触发layout resize事件
        updateLayoutSize: function () {
            var w = $(window).width();
            var h = $(window).height();
            var lname = this.layout.name;
            ievent.trigger(lname, {width: w, height: h}, lname);
        },
        addModules: function (mods) {
            var self = this;
            _.each(mods || [], function (mod, idx) {
                self.addModule(mod);
            });
        },
        addModule: function (mod) {
            mod.region = this;
            this.mods.push(mod);

            if (mod instanceof Layout) {
                mod.isSubLayout = true;
                mod.wrap.css({width: '100%', height: '100%'});
                mod.layout(this.context);
            } else { this.context.append(mod.render()); }
        },
        render: function () {
            return this.wrap;
        }
    };

    // -------------------------------------------------------------------------
    // Class Name Prefix
    var CNP = 'youdao-flexlayout-';

    function generateDIV(className) {
        return $('<div class="' + CNP + className + '">');
    }
    function generateTD() {
        return $('<td class="' + CNP + 'td" style="vertical-align:top;height:100%;">');
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
            exports = module.exports = FlexLayout;
        }
        exports.FlexLayout = FlexLayout;
    } else { root.FlexLayout = FlexLayout; }

}).call(this);