var flMain = FlexLayout.create({
    type   : 'row',
    width  : '100%',
    height : '50px',
    scheme : [
        {name: 'a', type: 'max'},
        {name: 'b', size: 20}
    ],
    style: 'position:fixed;bottom:10%;left:0;'
});

var flsub = FlexLayout.create({
    type   : 'row',
    width  : '100%',
    height : '100%',
    scheme : [
        {name: 's1', size: 77},
        {name: 's2', size: 120},
        {name: 's3', size: 60},

        {name: 's4', type: 'max'},

        {name: 's5', size: 100},
        {name: 's6', size: 60}
    ]
});

flsub.addModule(testmod('惠惠'), 's1');
flsub.addModule(testmod('降价提醒'), 's2');
flsub.addModule(testmod('签到'), 's3');

flsub.addModule(testmod('-'), 's4');

flsub.addModule(testmod('超值特价'), 's5');
flsub.addModule(testmod('反馈'), 's6');

flMain.addModule(flsub, 'a');
flMain.addModule(testmod('》'), 'b');
flMain.layout();

// -----------------------------------------------------------------------------
flMain.getRegion('b').wrap.click(function () {
    flMain.toggle('a');
});

var tmpid = 0;
var regionCache = [
    {status: true, obj: flsub.getRegion('s2')},
    {status: true, obj: flsub.getRegion('s3')},
    {status: true, obj: flsub.getRegion('s6')},
    {status: true, obj: flsub.getRegion('s5')}
];

var hasHide = function () {
    return !!_.find(regionCache, function (r) { return !r.status;});
};
var showRegionInCache = function () {
    var rg = _.find(regionCache, function (r) { return !r.status;});
    rg.status = true;
    flsub.show(rg.obj);
};
var hideRegionInCache = function () {
    var i = 0, len = regionCache.length, tmp;
    for (; i < len; i++) {
        if (!(regionCache[i].status)) {
            break;
        }
    }
    if (i === 0) return;
    i = i === len ? len - 1 : i - 1;
    var rg = regionCache[i];
    rg.status = false;
    flsub.hide(regionCache[i].obj);
};
flsub.getRegion('s4').on('resize', function (rs, ws, region) {
    // console.log(arguments);
    var w = rs.width, tmp;
    // console.log(region.name, ' : ', w);
    if (w > 150) {
        if (hasHide()) {
            showRegionInCache();
        } else {
            tmp = flsub.addRegion({size: 100}, -3);
            tmp.addModule(testmod(tmpid++));
            regionCache.push({status:true, obj: tmp});
        }
    } else if (w < 50) {
        hideRegionInCache();
    }
});