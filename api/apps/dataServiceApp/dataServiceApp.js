var App = {

	import:{
		Poloniex: require('poloniex-api-node'),
		Q: require('q'),
		PromiseFtp: require('promise-ftp'),
		fs: require('fs')
	},

	secret:{

	},

	//output : email :: 
	strategyFlash: async function(model){
		var trovermanTestId = '591a95d935ab691100c584ce  ';
		var trovermanRealId = '5a83602d5ac735000488e8f7'

		var orderModel = {};
        orderModel.assetPair = model.assetPair;
        orderModel.asset1 = model.asset1;
        orderModel.asset2 = model.asset2;
		orderModel.delta = model.delta;
		// BUY price needs to be above lowest ask
		// SELL price needs to be below highest bid
        orderModel.price = model.price; 
		orderModel.delta = delta;
        var emailList = ['mphillipsmusic@gmail.com', 'lourens1@ad.unc.edu', 'camcook88@gmail.com', 'jawestgard@gmail.com', 'vazio92@gmail.com', 'evolvedus@gmail.com', 'lahari.ganti.19@gmail.com', 'troverman@gmail.com'];
		//FLASH CRASH OF BUYING AND SELLING PRICE
        //BUY LOW
        if (model.percentChange < -0.15){
        	//LOOK AT HIGHEST BID
			for (x in emailList){emailService.sendTemplate('marketUpdate', emailList[x], 'MARKET UPDATE: BUY, '+ model.assetPair+' has changed '+model.percentChange*100+'% in '+model.delta/1000+' seconds', {data: model});}
            orderModel.type = 'BUY';
            //SIMULATION -- could do percent risk based on indicators
			dataService.createOrderSimulation(orderModel, trovermanTestId, 0.33);
            //LIVE -- TODO: 
            //LOOK AT lowestAsk PRICE!
			dataService.createOrderPoloniex(orderModel, trovermanRealId, 'BUY', 0.15, model.percentChange);//type --> FoK, IoC, MO, percent rish
			//logic based on ask, bid change. :)
			console.log('askChange', (model.lowestAsk - models[1].lowestAsk)/model.lowestAsk); console.log('bidChange', (model.highestBid - models[1].highestBid)/model.highestBid)
        }

        //THIS IS CURRENT PRICE	!!!!!! LAST PRICE IS 'HISTORY!!!!!' NOT CURRENT..
        //SELL HIGH
        if (model.percentChange > 0.15){
            for (x in emailList){emailService.sendTemplate('marketUpdate', emailList[x], 'MARKET UPDATE, '+ model.assetPair+' has changed '+model.percentChange*100+'% in '+model.delta/1000+' seconds', {data: model});}
        	orderModel.type = 'SELL';			                  
        	//SIMULATION
			dataService.createOrderSimulation(orderModel, trovermanTestId, 0.33);
        	//LIVE
			dataService.createOrderPoloniex(orderModel, trovermanRealId, 'SELL', 0.15, model.percentChange);
        }
        //5 MIN
        if (delta == '300000'){
        	//BUY LOW
			if (model.percentChange <= -0.035){
				for (x in emailList){emailService.sendTemplate('marketUpdate', emailList[x], 'MARKET UPDATE: BUY, '+ model.assetPair+' has changed '+model.percentChange*100+'% in '+model.delta/1000+' seconds', {data: model});}
				orderModel.type = 'BUY';
				//SIMULATION
				dataService.createOrderSimulation(orderModel, trovermanTestId, 0.33);
				//LIVE -- SCRY -- EXCITE
				if (model.percentChange <= -0.045){dataService.createOrderPoloniex(orderModel, trovermanRealId, 'BUY', 0.15, model.percentChange);}
        	}
        	//SELL HIGH
			if (model.percentChange >= 0.05){
                for (x in emailList){emailService.sendTemplate('marketUpdate', emailList[x], 'MARKET UPDATE, '+ model.assetPair+' has changed '+model.percentChange*100+'% in '+model.delta/1000+' seconds', {data: model});}
                orderModel.type = 'SELL';
				//SIMULATION
				dataService.createOrderSimulation(orderModel, trovermanTestId, 0.35);
			}
        }
        //TODO: REFACTOR
		//30 SEC
        if (delta == '30000'){
        	//BUY LOW FLASH DIP
			if (model.percentChange <= -0.035 && model.percentChange > -0.10){
				emailService.sendTemplate('marketUpdate', 'troverman@gmail.com', 'FLASH DIP: '+ model.assetPair+' has changed '+model.percentChange*100+'% in '+model.delta/1000+' seconds', {data: model});
				orderModel.type = 'BUY';
				//SIMULATION
				dataService.createOrderSimulation(orderModel, trovermanTestId, 0.5);
			}
			//BUY LOW FLASH CRASH
			if (model.percentChange <= -0.10){
				for (x in emailList){emailService.sendTemplate('marketUpdate', emailList[x], 'FLASH CRASH: '+ model.assetPair+' has changed '+model.percentChange*100+'% in '+model.delta/1000+' seconds', {data: model});}
				orderModel.type = 'BUY';
               	//SIMULATION
				dataService.createOrderSimulation(orderModel, trovermanTestId, 0.5);
				//LIVE
				dataService.createOrderPoloniex(orderModel, trovermanRealId, 'BUY', 0.15, model.percentChange);

			}
			//SELL HIGH
			if (model.percentChange >= 0.08){//|| or total price incease is some amount of profit
				orderModel.type = 'SELL';
				//SIMULATION
				dataService.createOrderSimulation(orderModel, trovermanTestId, 0.5);
				//LIVE
				dataService.createOrderPoloniex(orderModel, trovermanRealId, 'SELL', 0.15, model.percentChange);
			}
        }
        if (models[1].percentChange < -0.05){
			if (models[1].delta == '5000' || models[1].delta == '30000' || models[1].delta == '300000'){
				//GET PROTFOLIO.. SAMPLE. to make trading logic.
				if (model.percentChange > 0.05){//|| or totoal price incease is some amount of profit
					for (x in emailList){emailService.sendTemplate('marketUpdate', emailList[x], 'YOU BOUGHT THE DIP AND TOOK ' + model.percentChange*100 +'% profit', {data: model});}
					orderModel.type = 'SELL';
					//SIMULATION,
					dataService.createOrderSimulation(orderModel, trovermanTestId, 0.88);
				}
			}
        }
	},

	//btc connection --> send to wallet.. connect create identity.. wallet addressi,
	//do apps need to combile to webasm? 
	
	//TODO: TOKENIZE STOCKS APP
	//TOKENIZE SYMBOL STRING AS STRING
	//POPULATE TOKENS
	//LEGACY
		//REDUCE THE ABSTRACTION
		//STOCKS ARE BASE TOKEN AND +[EXCANGE] IDENTIFER
			//ASSOCIATION + GRAMMER
			//CONNECTION RULES IN + [EXCHANGE]

	populateStocks: async function(){

		//META MODEL FOR ATTENTION 
		//machieneAttention.create({
		//	type:'populateStocks',
		//	amount:1,
		//	context:{}
		//});

		//activityApp['CREATE']({
			//string:
			//data:
			//type:
		//});

		//tokenize all method calls as practice; design pattern

		//ALPHA VANTAGE API
		//https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=BA&apikey=3J08JZ9BNYK4JUTY

		//ftp://ftp.nasdaqtrader.com/SymbolDirectory/nasdaqtraded.txt
		//ftp://ftp.nasdaqtrader.com/SymbolDirectory/options.txt
		//ftp://ftp.nasdaqtrader.com/SymbolDirectory/bxoptions.txt
		//ftp://ftp.nasdaqtrader.com/SymbolDirectory/bxtraded.txt
		//IMPROVEMENT: REDUCE FROM LOCAL STORE
    	//Nasdaq Traded|Symbol|Security Name|Listing Exchange|Market Category|ETF|Round Lot Size|Test Issue|Financial Status|CQS Symbol|NASDAQ Symbol|NextShares
	 	async function nasdaqConnect(directory, file){
			var PromiseFtp = App.import.PromiseFtp;
			var ftp = new PromiseFtp();
			var fs = App.import.fs;
			var serverMesage = await ftp.connect({host: 'ftp.nasdaqtrader.com', user: '', password: ''})
			var stream = await ftp.get(directory+'/'+file);
			await new Promise(function (resolve, reject) {
				stream.once('close', resolve);
				stream.once('error', reject);
				stream.pipe(fs.createWriteStream('assets/data/'+file));
			});
			var data = await fs.promises.readFile('assets/data/'+file, 'utf8');
			var array = data.toString().split("\n");
			array.pop();array.pop();
			await ftp.end();
			return array;
		};

		//function nyseConnect(){};
		//function tseConnect(){};
		//Tokyo Stock Exchange, Japan
		//function tsxConnect(){};
		//Toronto Stock Exchange, Canada
		//Bombay Stock Exchange, India
		//Shenzhen Stock Exchange, China
		//London Stock Exchange, United Kingdom
		//Euronext, Eurozone
		//Hong Kong Stock Exchange, Hong Kong
		//Shanghai Stock Exchange, China
		//https://en.wikipedia.org/wiki/List_of_stock_exchanges

		var array = nasdaqConnect('SymbolDirectory','nasdaqtraded.txt');

	  	for(i in array) {
	    	var assetInformation = array[i].split('|');
	    	var assetModel = {
	    		string: 'NASDEQ+'+assetInformation[1],
    			description: assetInformation[2],
	    		information:{
	    			symbols:{
		    			symbol: assetInformation[1],
		    			cqsSymbol: assetInformation[9],
		    			nasdaqSymbol: assetInformation[10],
		    		},
		    		//PERHAPS ENCODE EXCHANGE TYPE INTO STRING.. BONDS ETC --> UNIFY WITH CRE8 MANIFOLD
	    			exchange: assetInformation[3],
	    			category: assetInformation[4],
	    			status: assetInformation[8],
	    			inCirculation:null,
					markets: null,
	    		},
				protocols:['CRE8','NASDEQ'],
				logic:{transferrable:true}
	    	};

	    	var assetModels = await Asset.find({string:assetModel.string})
    		if (assetModels.length == 0){
    			var newAssetModel = await Asset.create(assetModel);
				console.log(newAssetModel);
    		}

    		//TODO: UNIFY ORDERS AND VALIDATIONS
    		//TODO:EXPAND THE DEFINITION OF VALIDATION
    		//TODO: MULTI MARKET ALGS AND FUN :)
			//ASSOCIATIONS OF CONNECTION TYPE MARKET
			//CONNECTION(S) SOON --> POC (PROOF OF CONCEPT)

			//TODO: FXN TO COMPUTE 'MARKET' FROM ORDERS 
	    	//TRUST ME :) -- MARKET COMBINATORIAL OBJECTS

	    	//connections are dynamically instantiated 'abstract' data models 

	    	var associationModel = {
	    		//source, target
	    		//associatedModels
	    		associatedModels:[
		    		{
	    				id:assetModels[0].id, 
	    				type:'ASSET', 
	    				parameters:{label:'source'},
	    			},
	    			{
	    				id:'USD', 
	    				type:'ASSET', 
	    				parameters:{label:'target'},
	    			}
    			],
	    		connection: {
	    			type:'NASDEQ EXHANGE',
	    			parameters:{

	    				//config:{
	    				//	nodeParameters:true,
	    				//	modelParameters:true,
	    				//},

	    				association:{
	    					type:{type:'string'},
		    				parameters:{direction:{type:'string'}},
		    				associatedModels:[
		    					{
		    						parameters:{
		    							type:{type:'string'},
		    							label:{type:'string'}
		    						}
		    					},
		    					{
		    						parameters:{
		    							type:{type:'string'},
		    							label:{type:'string'}
		    						}
		    					},
		    				],

		    				//logic:[],
		    				//mapping:[],
		    				//reduction:[],

		    				//validation:{
    						//	type:{type:'string'},
    						//	type:{type:'type'},
		    				//	create:{type:'function'}
		    				//}, 			
		    			
		    				//validation:{
			    				//	type: 'order',
		    					//	parameters: {},
			    				//	create: function(model){
			    						//LOGIC FOR TRANSFERING BALANCES AND ESKROW TO MAKE AN ORDER 
			    						//BUILD ASSOCIATION
			    				//	},
			    				//}, 			
		    				//}
		    			},
	    				
	    				//model:[{
	    				//	bids:{type:[]},
	    				//	asks:{type:[]}
	    				//}],

	    				//association ::
	    				//validation ::
	    				//logic:[],
	    				//mapping:[],
	    				//reduction:[]
	    			    				 			
    				}
	    		},
	    		parameters:[{
	    			bids:[],
	    			asks:[],
	    		}],
	    	};

	    	//Association.create(associationModel);

	    	//USD-NASDEX
	    	//Asset (USD)
	    		//Market (USD-ETH)
	    			//Connection 
	    	//Model
	    		//Connection
	    			//Association
	    				//Validation
	    	//Asset
	    		//Connection
	    			//Market ( Association )
	    				//Order
	    	//{}={}
	    	//context:{}
	    	//(element, multiDContextObj);	
	    }

		//token and market
		//replace token with Asset. 
		//var tokenModel = {
		//	string:'SYMBOL',
		//	description:'',
		//	context:'',
		//	exchange:'',
		//	information:'',
		//  computed matrix?
		//};

	},

	BTCConnect: function(){},
	ETHConnect: function(){},
	ETHERC20Connect: function(){},
	ETHERC721Connect: function(){},
	LTCConnect: function(){},
	//save each possible connection

	//INDICATORS

	//UTILS
	cullData: async function(delta, time){
		var now = new Date(), start = new Date(now.getTime() - (time));
		console.log(delta, time)
		var data = await Data.find().limit(10000).where({createdAt: {'<': start}, delta:delta});
    	console.log(data)
    	if (data.length > 0){
    		var idArray = data.map(function(obj) {return obj.id});
    		console.log(idArray);
			Data.destroy(idArray, function(err, model) {console.log(err, model);console.log('deleted');});
    	}
	},
	cullTrade: async function(time){
		var now = new Date(), start = new Date(now.getTime() - (time));
		var data = await Trade.find().limit(10000).where({createdAt: {'<': start}});
    	if (data.length > 0){
    		var idArray = data.map(function(obj) {return obj.id});
    		console.log(idArray);
			Trade.destroy(idArray, function(err, model) {
				console.log(err, model);
				console.log('deleted');
			});
    	}
	},
	//POLONIEX APP ::::
	//TODO: REMOVE / LINK TO MARKET IMAGE
	tickerREST: async function(delta){
	    var poloniex = new App.import.Poloniex();  
		poloniex.returnTicker(async (err, ticker) => {
			if (err) {console.log(err.message)}
			else {
				for (x in Object.keys(ticker)){
					var data = ticker[Object.keys(ticker)[x]]
					var model = {
						exchange: 'POLONIEX',
						assetPair:Object.keys(ticker)[x],
						asset1:Object.keys(ticker)[x].split('_')[0],
						asset2:Object.keys(ticker)[x].split('_')[1],
						price:data.last,
						currentBid:data.highestBid,
						currentAsk:data.lowestAsk,
						delta:delta,
					};
					var model = await Data.create(model);

					Data.publishCreate(model);
		            var models = await Data.find({assetPair:model.assetPair, delta: model.delta}).sort('createdAt DESC').limit(100)

	                model.absoluteChange = model.price - models[1].price;
	                model.percentChange = model.absoluteChange/model.price;
	                model.absoluteChangeChange = model.absoluteChange - models[1].absoluteChange;
	                Data.update({id:model.id}, model);

	                //TODO: LINK IN ORDER HISTORY :: FIND
					//TODO: INJECT SOME INDICATORS?? ANALYIS ~ PDF?
					//TODO:: MORE STRATS
					//SUPERTODO:: STRAT ON MARKET IMAGE INPUT :P
					//CALL RECOMENDATION ENGINE :::::
					App.strategyFlash(model);
				}
			}
		});
	},
	//save order book? --> orderbook analysis.. can manipulate the price.. hmmm  ie. how real is book
	returnOrderBook: function(assetPair, depth){
		var poloniex = new App.import.Poloniex();  
		var deferred = App.import.Q.defer();
		poloniex.returnOrderBook(assetPair, depth, function(err, data){deferred.resolve(data);});
		return deferred.promise;
	},
	//I can place continuous orders at the bband indicator
	//createOrderContinual:function(){
		//create order with 15% down on price at every delta. 
		//cancel last order id if not fuilfilled--> atomic switch to the next. 
		//save fees by making the market ready for strat; risk it by locking into this order
	//}
	createOrderPoloniex: async function(model, user, type, percent, percentChange){
		var poloniex = new App.import.Poloniex('KEY', 'SECRET');  
		//TODO: DATA AS A MODEL
		//TODO: REFACTOR
		//TODO.. really should be using lowest ask as the denominator vs price of last trade
		var orderModel = model;
		orderModel.assetPair = model.assetPair;
		orderModel.asset1 = model.asset1;
		orderModel.asset2 = model.asset2;
		orderModel.price = model.price;
		orderModel.delta = model.delta;
		orderModel.type = type;
		var orderBook = await dataService.returnOrderBook(model.assetPair, 10);

        if (orderModel.type=='BUY'){
			//may be better to call poloniex balance vs interal storage
	        var asset = await Asset.find({user: user, symbol: orderModel.asset1})
			console.log('REAL BUY', orderModel);

        	//for FoK, IoC
        	//var highestBid = orderBook.bids[0][0];
			var lowestAsk = orderBook.asks[0][0];

			//TODO: ORDERBOOK
				//orderModel.amount = (asset[0].amount*percent)/orderModel.price; 
			orderModel.amount = (asset[0].amount*percent)/lowestAsk; 
            var asset1Amount = asset[0].amount - asset[0].amount*percent;

            //TODO: LOOP THRU ORDER BK COMPLETE
            if (orderModel.amount <= orderBook.asks[0][1]){
				orderModel.amount = (asset[0].amount*percent)/lowestAsk;
				asset1Amount = asset[0].amount - asset[0].amount*percent;;
            }
            else{
				orderModel.amount = orderBook.asks[0][1]
				asset1Amount = asset[0].amount - orderBook.asks[0][1]*lowestAsk;
            }

			//BUY price needs to be above lowest ask;
			//-- gotta make sure there is enought volume on book
			//parseFloat(orderBook.asks[0][0])+parseFloat(orderBook.asks[0][0])*.001

			//if latest orderBook price !differ from price by x percent..
			//lowestAsk - OrderModel.price

			//only buy if more than .0001 btc
			if (orderModel.amount>0.0001){
				//TODO: FACTOR INTO ORDERMODEL
				console.log(orderModel.assetPair, lowestAsk.toString(), orderModel.amount.toString());
				console.log('compare', lowestAsk, orderModel.price, (orderModel.price-lowestAsk)/orderModel.price);

				//PRICE MUSH BE WITHIN 0.3 percent diff of price percent change.... 
				//should just do on Lowest Ask change? !! TRY IT!
				if (Math.abs((orderModel.price-lowestAsk)/orderModel.price) < 0.3*percentChange){
		            poloniex.buy(orderModel.assetPair, lowestAsk.toString(), orderModel.amount.toString(), 0, 1, 0, async function(err, model){
		            	console.log(err, model)
						//if fuilfilled --> 
						if (!err && model && model.resultingTrades.length > 0){
							console.log('REAL BUY');
							var orderModel = await Order.create(orderModel);

		            		//IS THIS NEEDED?
							//may be better to call poloniex balance update
							await Asset.update({user: user, symbol:orderModel.asset1}, {amount:asset1Amount});
							var asset = await Asset.find({user: user, symbol: orderModel.asset2});

							//FACTOR IN FEES
							//TODO: BETTER -- model.resultingTrades[0]
							var updateAmount = (asset[0].amount + orderModel.amount) - (orderModel.amount)*0.0025; //TAKER; maker is 0.0015
							await Asset.update({user: user, symbol: orderModel.asset2}, {amount:updateAmount});
							
							//TODO:FACTOR INTO ORDERMODEL
							var emailModel = orderModel;
							emailModel.price =  model.resultingTrades[0].rate;
							emailModel.amount = model.resultingTrades[0].amount;
							emailService.sendTemplate('orderCreate', 'troverman@gmail.com', 'REAL BUY ' + orderModel.asset2, {data: emailModel});

							//PLACE IMMEDIATE SELL ORDER AT PROFIT TAKE %
							//ratio of delta to percent
							//golden ratio 1.61803398875
							//TODO: CHECK LOGS..

							var sellPrice = parseFloat(model.resultingTrades[0].rate)+parseFloat(model.resultingTrades[0].rate)*Math.abs(percentChange/1.5);
							var sellAmount = orderModel.amount - (orderModel.amount)*0.0025
							console.log('ONBOOKS', 'PRICE', sellPrice, 'AMOUNT', sellAmount);
							console.log('compare', model.resultingTrades[0].rate, orderModel.price);

							poloniex.sell(orderModel.assetPair, sellPrice.toString(), sellAmount.toString(), 0, 0, 1, function(err, model){

								//TODO: REFACTOR ORDERMODEL
								var emailModel = orderModel;
								emailModel.price = sellPrice;
								emailModel.amount = sellAmount;
								emailService.sendTemplate('orderCreate', 'troverman@gmail.com', 'REAL SELL ON BOOKS ' + orderModel.asset2, {data: emailModel});
								console.log(model);

								//TODO: listen for updates on an interval
								//every 5 seconds to see if fulifilled.. 
								//edit Asset
								//dataService.returnBalances(user);

								//CREATE ORDER.. onBooks
								//Order.create(orderModel).then(function(orderModel){
	            					//console.log(orderModel);
	            				//});
							});
						}
					});
				}
			}

			//TODO: ORDER BOOK ANALYSIS FOR LRG BUYS AND SELLS
			//experimental multiple order in order book.. 
			/*
			var orderAmount = orderModel.amount;
			for (x in orderBook.asks[0]){
				//-- gotta make sure there is enought volume on book
				if (orderAmount > orderBook.asks[x][1]){
					orderAmount - orderBook.asks[x][1];
					//always place order with orderModel;
	            	poloniex.buy(orderModel.assetPair, orderBook.asks[x][0].toString(), orderBook.asks[x][1].toString(), 0, 1, 0, function(err, model){
						console.log(err, model);
						if (model.resultingTrades.length > 0){
							console.log('REAL BUY');
							emailService.sendTemplate('orderCreate', 'troverman@gmail.com', 'REAL BUY' + orderModel.asset2, {data: orderModel});
							dataService.returnBalances();
						}
	            	});
				}
				else{
					//BUY price needs to be above or at lowest ask;
					//parseFloat(orderBook.asks[0][0])+parseFloat(orderBook.asks[0][0])*.001
					poloniex.buy(orderModel.assetPair, orderBook.asks[x][0].toString(), orderAmount.toString(), 0, 1, 0, function(err, model){
						console.log(err, model);
						if (model.resultingTrades.length > 0){
							console.log('REAL BUY');
							emailService.sendTemplate('orderCreate', 'troverman@gmail.com', 'REAL BUY' + orderModel.asset2, {data: orderModel});
							dataService.returnBalances();
						}
					});

					//if type
					//TODO: BE A MARKET MAKER..  
					//TODO: add minimal amnt more.
					//var price = parseFloat(orderBook.bids[0][0])+parseFloat(orderBook.bids[0][0])*.001;
					//-- look at fee and spread 1st
					//poloniex.buy(orderModel.assetPair, price.toString(), orderModel.amount.toString(), 0, 0, 1, function(err, model){
						//console.log(err, model);
						//if (model.resultingTrades.length > 0){
						//	console.log('REAL BUY');
						//	emailService.sendTemplate('orderCreate', 'troverman@gmail.com', 'REAL BUY ON BOOKS' + orderModel.asset2, {data: orderModel});
						//	dataService.returnBalances();
						//}
					//});
				}
			}
			*/
				
		}

        //SELL
		if (orderModel.type=='SELL'){
			//may be better to call poloniex balance vs interal storage?  --> does this need to persist? 
       		var asset = await Asset.find({user: user, symbol:orderModel.asset2});
			console.log('REAL SELL', orderModel);

			//SELL price needs to be below highest bid
			//console.log('TEST SELL', parseFloat(data.bids[0][0])-parseFloat(data.bids[0][0])*.001);

			//for FoK, IoC
        	var highestBid = orderBook.bids[0][0];
			//var lowestAsk = orderBook.asks[0][0];

			//TODO: ORDERBOOK
			//-->orderBook analysis
        	orderModel.amount = asset[0].amount*percent;
        	var asset2Amount = asset[0].amount - asset[0].amount*percent;

			//only sell if more than .0001 btc
			if (orderModel.amount>0){
				console.log(orderModel.assetPair, highestBid.toString(), orderModel.amount.toString());
				//LOST MONEY ONCE HERE BC HIGHET BID WAS LOOOOOW and LAST TRADE PRICE WAS HIGH..
				console.log('PRICE COMPARE', highestBid.toString(), orderModel.price)
				if (highestBid.toString() == orderModel.price){
		            poloniex.sell(orderModel.assetPair, highestBid.toString(), orderModel.amount.toString(), 0, 1, 0, async function(err, model){
		            	console.log(err, model)
						//if fuilfilled --> 
						if (!err && model && model.resultingTrades.length > 0){
							console.log('REAL COMPLETE');
							await Order.create(orderModel);
							//IS THIS NEEDED?
							//may be better to call poloniex balance update
							await Asset.update({user: user, symbol: orderModel.asset2}, {amount:asset2Amount});
							var asset = await Asset.find({user: user, symbol: orderModel.asset1});
							var updateAmount = (asset[0].amount + orderModel.amount*orderModel.price) - (orderModel.amount*orderModel.price)*0.0025;//TAKER; maker is 0.0015
							await Asset.update({user: user, symbol: orderModel.asset1}, {amount:updateAmount});
							emailService.sendTemplate('orderCreate', 'troverman@gmail.com', 'REAL SELL ' + orderModel.asset2, {data: orderModel});
						}
					});
				}
				//ELSE PALCE ON BOOK??
			}
    	}
   	 	//if flash crash --- SUPER MARGIN BUY LOL
		//marginBuy(currencyPair, rate, amount, lendingRate [, callback])
	},
	//TODO: REFACTOR PARAMETERS
	//LEGACY
	createOrderSimulation: async function(model, user, percent){
		var orderModel = model;
		orderModel.assetPair = model.assetPair;
		orderModel.asset1 = model.asset1;
		orderModel.asset2 = model.asset2;
		orderModel.price = model.price;
		orderModel.delta = model.delta;
		orderModel.user = user;

		var orderBook = await dataService.returnOrderBook(model.assetPair, 10);
		if (orderModel.type == 'BUY'){
	        var asset = await Asset.find({user:user, symbol: orderModel.asset1});
            orderModel.amount = (asset[0].amount*percent)/orderModel.price;
            var asset1Amount = asset[0].amount - asset[0].amount*percent;
            //TODO TYPE..
			var orderAmount = orderModel.amount;
			for (x in orderBook.asks[0]){
				if (orderAmount > orderBook.asks[x][1]){
					//orderAmount - orderBook.asks[x][1];
	            	//poloniex.buy(orderModel.assetPair, orderBook.asks[x][0].toString(), orderBook.asks[x][1].toString(), 0, 1, 0, function(err, model){});
				}
				else{
					//poloniex.buy(orderModel.assetPair, orderBook.asks[x][0].toString(), orderBook.asks[x][1].toString(), 0, 1, 0, function(err, model){});
				}
			}
			var orderModel = await Order.create(orderModel);	
			//ORDER BOOK? --> SURE!
			await Asset.update({user:user, symbol: orderModel.asset1}, {amount:asset1Amount});
			var asset = await Asset.find({user:user, symbol: orderModel.asset2});
			var updateAmount = asset[0].amount + orderModel.amount;
			await Asset.update({user:user, symbol: orderModel.asset2}, {amount:updateAmount});
			emailService.sendTemplate('orderCreate', 'troverman@gmail.com', 'CREATE ORDER: BUY ' + orderModel.asset2, {data: orderModel});
    	}
    	if (orderModel.type == 'SELL'){
	        var asset = await Asset.find({user:user, symbol: orderModel.asset2});
        	orderModel.amount = asset[0].amount*percent;
        	var asset2Amount = asset[0].amount - asset[0].amount*percent;
    		//TODO TYPE..
			var orderAmount = orderModel.amount;
			for (x in orderBook.asks[0]){
				if (orderAmount > orderBook.asks[x][1]){
					//orderAmount - orderBook.asks[x][1];
	            	//poloniex.buy(orderModel.assetPair, orderBook.asks[x][0].toString(), orderBook.asks[x][1].toString(), 0, 1, 0, function(err, model){});
				}
				else{
					//poloniex.buy(orderModel.assetPair, orderBook.asks[x][0].toString(), orderBook.asks[x][1].toString(), 0, 1, 0, function(err, model){});
				}
			}
			await Order.create(orderModel);
			await Asset.update({user:user, symbol: orderModel.asset2}, {amount:asset2Amount});
			var asset = await Asset.find({user:user, symbol: orderModel.asset1})
			var updateAmount = asset[0].amount + orderModel.amount*orderModel.price;
			await Asset.update({user:user, symbol: orderModel.asset1}, {amount:updateAmount});
			emailService.sendTemplate('orderCreate', 'troverman@gmail.com', 'CREATE ORDER: SELL ' + orderModel.asset2, {data: orderModel});    
    	}
	},




};
module.exports = App;