(function() {
	var https = require('https');

	function todmg(key) {
		this.key = key;
	}

	todmg.prototype.getChampionsStatus = function(region, callback) {
		var url         = 'https://' + region + '.api.pvp.net/api/lol/' + region + '/v1.2/champion?api_key=' + this.key,
			champions   = "";

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

	todmg.prototype.getChampionsNames = function(region, callback) {
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


	module.exports = todmg
}());