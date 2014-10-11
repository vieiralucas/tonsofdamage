(function() {
    var https = require('https');

    function TonsOfDamage(key) {
        this.key = key;
        this.champions = {}; // the idea is {na: {champs, idSearch} br: {champs, idSearch, nameSearch}}
    }

    TonsOfDamage.create = function(key) {
        return new TonsOfDamage(key);
    }

    TonsOfDamage.prototype.getChampionsStatus = function(region, callback) {
        var url       = 'https://' + region + '.api.pvp.net/api/lol/' + region + '/v1.2/champion?api_key=' + this.key,
            champions = "";

        https.get(url, function(res) {
            res.on('error', function(err) {
                callback(err);
            });
            res.on('data', function(data) {
                champions += data.toString();
            });
            res.on('end', function() {
                callback(null, JSON.parse(champions).champions);
            });
        });

    };

    TonsOfDamage.prototype.getChampionsName = function(region, callback) {
        var url       = 'https://' + region + '.api.pvp.net/api/lol/static-data/' + region + '/v1.2/champion?api_key=' + this.key,
            champions = "";

        https.get(url, function(res) {
            res.on('error', function(err) {
                callback(err);
            });
            res.on('data', function(data) {
                champions += data.toString();
            });
            res.on('end', function() {
                var data    = JSON.parse(champions).data,
                response = [];
                for(var d in data) {
                    if(data.hasOwnProperty(d)) {
                        response.push({id: data[d].id, key: data[d].key, name: data[d].name, title: data[d].title});
                    } 
                }
                callback(null, response);
            })
        });
    };

    TonsOfDamage.prototype.getChampionById = function(region, id, callback) {
        if(this.champions[region]) {
            return callback(this.champions[region].idSearch[id]);
        }
        var that = this;
        this.getChampionsInfo(region, function(err, champs) {
            if(err) {
                return callback(err);
            }
            callback(null, that.champions[region].idSearch[id]);
        })
    };

    TonsOfDamage.prototype.getChampionByName = function(region, name, callback) {
        if(this.champions[region]) {
            return callback(this.champions[region].nameSearch[name.toLowerCase()]);
        }
        var that = this;
        this.getChampionsInfo(region, function(err, champs) {
            if(err) {
                return callback(err);
            }
            callback(null, that.champions[region].nameSearch[name.toLowerCase()]);
        })  
    };

    TonsOfDamage.prototype.getChampionsInfo = function(region, callback) {
        if(this.champions[region]) {
            return callback(null, this.champions[region].champs);
        }
        var status = null, 
            names  = null,
            result = [],
            that   = this;

        this.getChampionsStatus(region, function(err, champs) {
            if(err) {
                return callback(err);
            }
            status = champs;
            if(names) {
                join();
            }
        });

        this.getChampionsName(region, function(err, champs) {
            if(err) {
                return callback(err);
            }
            names = champs;
            if(status) {
                join();
            }
        });

        function join() {
            for(var s = 0; s < status.length; s++) {
                for(var n = 0; n < names.length; n++) {
                    if(status[s].id === names[n].id) {
                        result.push(mergeObjects(status[s], names[n]));
                        names.splice(n, 1);
                    }
                }
            }
            result.sort(function(a, b) {
                return Number(a.id) - Number(b.id);
            })
            that.champions[region] = {};
            that.champions[region].champs = result;
            var idSearch   = {},
                nameSearch = {};
            for (var i = 0; i < result.length; i++) {
                idSearch[result[i].id] = result[i];
                nameSearch[result[i].name.toLowerCase()] = result[i];
            }
            that.champions[region].idSearch = idSearch;
            that.champions[region].nameSearch = nameSearch;
            callback(null, result);
        }
    };

    function mergeObjects(obj1, obj2){
        var obj3 = {};
        for (var attr in obj1) { 
            obj3[attr] = obj1[attr];
        }
        for (var attr in     obj2) {
            obj3[attr] = obj2[attr];
        }
            return obj3;
        }

    module.exports = TonsOfDamage;
}());