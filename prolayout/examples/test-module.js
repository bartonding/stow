(function (root) {

    function heredoc(fn) {
        return fn.toString()
            .replace(/^[^\/]+\/\*!?/, '')
            .replace(/\*\/[^\/]+$/, '')
            .replace(/^\s+/, '')
            .replace(/\s+$/, '');
    }
    var testString = heredoc(function(){/*
        <div class="mod">{{content}}</div>
    */});
    var generateString = function (content) {
        return testString.replace('{{content}}', content);
    };


    // -------------------------------------------------------------------------
    // -- test module
    // -------------------------------------------------------------------------
    root.testModule1 = (function () {
        var mod = function () {};

        mod.render = function () {
            return generateString('test module 1');
        };

        return mod;
    })();

    root.testModule2 = (function () {
        var mod = function () {};

        mod.render = function () {
            return generateString('test module 22');
        };

        return mod;
    })();

    root.testModule3 = (function () {
        var mod = function () {};

        mod.render = function () {
            return generateString('test module 333');
        };

        return mod;
    })();

})(this);