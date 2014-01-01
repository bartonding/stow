var main = FlexLayout.create({
    type: 'row',
    width: '100%',
    height: '50px',
    scheme: [
        {name: 'a', type: 'max'},
        {name: 'b', size: 10}
    ]
});
// pl.getRegion('region-1').addModules([]);
pl.addModule(testModule1, 'a');
// pl.addModules([testModule1, testModule1], 'a');
pl.getRegion('b').addModule(testModule2);
// pl.getRegion('b').addModule(pl1);
// pl.getRegion('b').addModules([testModule2, testModule2]);
pl.addModules([testModule3], 'c');
pl.layout();