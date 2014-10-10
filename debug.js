var todmg = require('./todmg.js').create('0f193184-5408-4447-a3af-3052cc156732');

todmg.getChampionStatusById('br', 1, function(err, champ) {
    if(err)
        return console.error(err);
    console.dir(champ);
})

/*todmg.getChampionsNames('br', function(err, data) {
    console.dir(data);
});*/