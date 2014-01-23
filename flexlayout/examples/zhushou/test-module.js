(function (root) {

var mid = 0;
var creattModID = function () {
    mid += 1;
    return 'test_mod_id_' + mid;
};

var random = function (min, max) {
    return (Math.random() * (max - min) + min) | 0;
}
var randomColor = function () {
    var n1 = random(100, 255).toString(16);
    if (n1.length === 1) n1 = '0' + n1;

    var n2 = random(100, 255).toString(16);
    if (n2.length === 1) n2 = '0' + n2;

    var n3 = random(10, 255).toString(16);
    if (n3.length === 1) n3 = '0' + n3;

    return '#'+n1+n2+n3;
};

root.testmod = function (content) {
    return (function (mod) {
        var id = creattModID();
        mod.render = function (data) {
            return [
                '<div id="'+id+'" style="width:100%;height:100%;',
                    'background-color:'+randomColor()+';',
                    'text-align:center;line-height:50px;',
                '" class="mod">',
                    '<a href="javascript:void(0);">', content, '<i></i></a>',
                '</div>'
            ].join('');
        };
        mod.initialize = function (container) {
            var region = mod.region;
            region.context.find('div.mod').on('click', function (evt) {
                var self = $(this);
                console && console.log && console.log(
                    region.name);
            });
        };
        mod._layoutResize = function (rs, ws, ctx) {
            $('#'+id).closest('td').attr('class', 'max');
            $('#'+id).find('a').html(rs.width);
        };
        return mod;
    })(function(){});
};

})(this);