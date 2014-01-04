(function (root) {

    function heredoc(fn) {
        return fn.toString()
            .replace(/^[^\/]+\/\*!?/, '')
            .replace(/\*\/[^\/]+$/, '')
            .replace(/^\s+/, '')
            .replace(/\s+$/, '');
    }
    var testString = heredoc(function(){/*
        <div class="mod" style="background-color:{{color}};width:100%;height:100%;">{{content}}</div>
    */});
    var generateString = function (content, color) {
        return testString.replace('{{content}}', content).
            replace('{{color}}', color);
    };


    // -------------------------------------------------------------------------
    // -- test module
    // -------------------------------------------------------------------------
    root.testModule1 = (function () {
        var mod = function () {};

        mod.render = function () {
            // return generateString('test module 1', 'red');
            return generateString('<div style="height:100px;">111</div>', 'red');
        };
        mod._layoutResize = function (rs, ws, ctx) {
            // console.log('mod1 ......');
            ctx.find('div.mod').html([JSON.stringify(rs), JSON.stringify(ws)].join('<br/>'));
        };

        return mod;
    })();

    root.testModule2 = (function () {
        var mod = function () {};

        mod.render = function () {
            return generateString('test module 22', 'yellow');
        };
        mod._layoutResize = function (rs, ws, ctx) {
            // console.log('mod2 ......');
            // console.log('mod2 ', arguments);
            // console.log(mod.region);
            // ctx.find('div.mod').html([JSON.stringify(rs), JSON.stringify(ws)].join('<br/>'));
        };

        var xx = 0;
        mod.xxrun = function () {
            xx++;
            // console.log('xxrun: ', xx++);
            if (!mod.region) return;
            var region = mod.region;
            var m = region.layout.regions['a1'].context.find('div.mod');
            // console.log(m);
            // m.height((xx%2===1)?30:100);
            m.width((xx%2===1)?30:100);
            region.updateLayoutSize && region.updateLayoutSize();
        };

        return mod;
    })();
    // window.setInterval(testModule2.xxrun, 1000);
    // window.setTimeout(testModule2.xxrun, 1000);

    root.testModule3 = (function () {
        var mod = function () {};

        var node = null;

        mod.render = function () {
            return generateString('test module 333', 'green');
        };
        mod._layoutResize = function (rs, ws, ctx) {
            // console.log('mod3 ......');
            // console.log('mod3 ',arguments);
            ctx.find('div.mod').html([JSON.stringify(rs), JSON.stringify(ws)].join('<br/>'));
        };

        return mod;
    })();

})(this);