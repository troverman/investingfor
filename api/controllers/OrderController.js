module.exports = {

	getSome: function(req, res) {

		var delta = req.query.delta;
		var asset1 = req.query.asset1;
		var asset2 = req.query.asset2;
		var user = req.query.user;//mb..--> system wide trading 
		var type =  req.query.type;
		var limit = req.query.limit;
		var skip = req.query.skip;
		var sort = 'createdAt DESC';//req.query.filter;

		console.log('GET ORDERS', req.query);

		//hak --> clean up if we want #cre8
		if (asset1 && asset2){
			Order.find()
			.where({asset1:asset1, asset2:asset2})
			.limit(limit)
			.skip(skip)
			.sort(sort)
			.then(function(model) {
				res.json(model);
			});
		}
		if (asset1 && !asset2){
			Order.find()
			.where({asset1:asset1})
			.limit(limit)
			.skip(skip)
			.sort(sort)
			.then(function(model) {
				res.json(model);
			});
		}
		else{
			Order.find()
			.limit(limit)
			.skip(skip)
			.sort(sort)
			.then(function(model) {
				res.json(model);
			});
		}
	},

	create: function (req, res) {

		var model = {
			asset1: req.param('asset1'),
			asset2: req.param('asset2'),
			price: req.param('price'),
			amount: req.param('amount'),
			status: req.param('status'),
		};

		Order.create(model)
		.exec(function(err, model) {
			if (err) {return console.log(err);}
			else {
				Order.publishCreate(model.toJSON());
				res.json(model);
			}
		});

	}
};