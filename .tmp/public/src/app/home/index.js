angular.module( 'investing.home', [
])

.config(['$stateProvider', function config( $stateProvider ) {
    $stateProvider.state( 'home', {
        url: '/',
        views: {
            "main": {
                controller: 'HomeCtrl',
                templateUrl: 'home/index.tpl.html'
            }
        },
        resolve:{
            currencyData: ['DataModel', function(DataModel) {
                //return DataModel.getCurrency();
                return null;
            }],
            marketData: ['DataModel', function(DataModel) {
                return DataModel.getData(100, 0, 'createdAt DESC', 'BTC', 'LTC', 5000);
            }],
            predictionData: ['PredictionModel', function(PredictionModel) {
                return PredictionModel.getSome(100, 0, 'createdAt DESC', {asset1:'BTC', asset2:'USD', predictionTime:'300000'});
            }],
        }
    });
}])

.controller( 'HomeCtrl', ['$sailsSocket', '$scope', 'titleService', 'config', 'currencyData', 'DataModel', 'marketData', 'predictionData', function HomeController( $sailsSocket, $scope, titleService, config, currencyData, DataModel, marketData, predictionData ) {
    titleService.setTitle('investingfor');
    $scope.currentUser = config.currentUser;
    $scope.predictionData = predictionData;

    $scope.marketData = marketData;
    console.log(marketData);

    $scope.selectedPair = ['BTC','LTC'];
    $scope.selectedDelta = '5000';

    $scope.seletetData = function (asset1, asset2, delta){
        $scope.selectedPair = [asset1, asset2];
        $scope.selectedDelta = delta;
        DataModel.getData(100, 0, 'createdAt DESC', asset1,  asset2, delta).then(function(model){
            $scope.marketData = model;
            $scope.updateMarketData();
        })
    };

    $scope.tradingPairs = [
        'XRP/BTC',
        'ETH/BTC',
        'BTC/USDT',
        'LTC/BTC',
        'BCH/BTC',
        'XRP/USDT',
        'XLM/BTC',
        'ETH/USDT',
        'BCH/USDT',
        'XMR/BTC',
        'ZEC/BTC',
        'LTC/USDT',
        'DASH/BTC',
        'ETC/BTC',
        'XEM/BTC',
        'ZEC/USDT',
        'FCT/BTC',
        'ETC/USDT',
        'BTS/BTC',
        'LSK/BTC',
        'DGB/BTC',  
        'EMC2/BTC',
        'NXT/BTC',
        'SC/BTC',
        'POT/BTC',  
        'STRAT/BTC',
        'NXT/USDT',
        'DOGE/BTC',
        'DASH/USDT',
        'XMR/USDT',
        'BCH/ETH',
        'ZRX/BTC',  
        'ARDR/BTC',
        'VTC/BTC',
        'BTM/BTC',  
        'OMG/BTC',
        'MAID/BTC',
        'VRC/BTC',  
        'GNT/BTC',  
        'GAME/BTC',
        'CVC/BTC',  
        'REP/BTC',
        'STEEM/BTC',
        'SYS/BTC',
        'BCN/BTC',
        'LBC/BTC',
        'DCR/BTC',
        'ZEC/ETH',
        'REP/USDT',
        'ETC/ETH',
        'LTC/XMR',
        'ZRX/ETH',
        'RIC/BTC',
        'GNO/BTC',
        'PPC/BTC',
        'GAS/BTC',
        'BURST/BTC',
        'PASC/BTC', 
        'VIA/BTC',
        'FLO/BTC',
        'FLDC/BTC',
        'NEOS/BTC', 
        'OMG/ETH',
        'STORJ/BTC',
        'GNT/ETH',
        'CLAM/BTC', 
        'NAV/BTC',
        'XCP/BTC',
        'LSK/ETH',
        'XBC/BTC',
        'AMP/BTC',
        'OMNI/BTC', 
        'EXP/BTC',
        'GRC/BTC',
        'BLK/BTC',  
        'SBD/BTC',
        'PINK/BTC',
        'NMC/BTC',
        'RADS/BTC', 
        'GNO/ETH',
        'NXC/BTC',
        'XVC/BTC',
        'CVC/ETH',
        'BELA/BTC',
        'NXT/XMR',
        'ZEC/XMR',
        'XPM/BTC',
        'BTCD/BTC', 
        'REP/ETH',
        'BCY/BTC',
        'MAID/XMR', 
        'DASH/XMR', 
        'HUC/BTC',
        'STEEM/ETH',
        'BCN/XMR',
        'BTCD/XMR', 
        'BLK/XMR'
    ];


    $scope.options = {
        chart: {
            type: 'lineWithFocusChart',
            height: 450,
            margin : {
                top: 20,
                right: 20,
                bottom: 60,
                left: 65
            },
            x: function(d){ 
                return d[0]; 
            },
            y: function(d){ 
                return d[1]; 
            },

            color: d3.scale.category10().range(),
            duration: 1500,
            useInteractiveGuideline: true,
            clipVoronoi: true,

            xAxis: {
                axisLabel: 'Time',
                tickFormat: function(d) {
                    return d3.time.format('%m/%d/%y %H:%M:%S')(new Date(d))
                },
                staggerLabels: true
            },

            yAxis: {
                axisLabel: 'USD/BTC',
                axisLabelDistance: 50
            }
        }
    };

    $scope.predictionAskData = {};
    $scope.predictionAskData.key = 'Prediction Ask';
    $scope.predictionAskData.color = '#ff7f0e';
    $scope.predictionAskData.values = [];

    $scope.predictionBidData = {};
    $scope.predictionBidData.key = 'Prediction Bid';
    $scope.predictionBidData.color = '#2ab996';
    $scope.predictionBidData.values = [];

    $scope.actualAskData = {};
    $scope.actualAskData.key = 'Actual Ask';
    $scope.actualAskData.color = '#a94442';
    $scope.actualAskData.values = [];

    $scope.actualBidData = {};
    $scope.actualBidData.key = 'Actual Bid';
    $scope.actualBidData.color = '#2ca02c';
    $scope.actualBidData.values = [];
    $scope.updateData = function (){
        $scope.predictionData.reverse().forEach(function(obj){ 

            if (obj.actualAsk == 0){obj.actualAsk = null}
            if (obj.actualBid == 0){obj.actualBid = null}
            var predictionAskModel = [ parseInt(new Date(obj.createdAt).getTime() + parseInt(obj.predictionTime)), obj.predictedAsk];
            var predictionBidModel = [ parseInt(new Date(obj.createdAt).getTime() + parseInt(obj.predictionTime)), obj.predictedBid];
            var actualAskModel = [ parseInt(new Date(obj.createdAt).getTime() + parseInt(obj.predictionTime)), obj.actualAsk];
            var actualBidModel = [ parseInt(new Date(obj.createdAt).getTime() + parseInt(obj.predictionTime)), obj.actualBid];

            $scope.predictionAskData.values.push(predictionAskModel);
            $scope.predictionBidData.values.push(predictionBidModel);
            $scope.actualAskData.values.push(actualAskModel);
            $scope.actualBidData.values.push(actualBidModel);

        });

        $scope.data = [$scope.predictionAskData, $scope.actualAskData, $scope.predictionBidData, $scope.actualBidData];
        console.log($scope.data);
    }
    $scope.updateData();
    
    /*
    var color = d3.scale.category20()
    $scope.directedOptions = {
        chart: {
            type: 'forceDirectedGraph',
            height:  (function(){ return nv.utils.windowSize().height })(),
            width: (function(){ return nv.utils.windowSize().width })(),
            margin:{top: 20, right: 20, bottom: 20, left: 20},
            color: function(d){
                return color(d.group)
            },
            nodeExtras: function(node) {
                node && node
                  .append("text")
                  .attr("dx", 8)
                  .attr("dy", ".35em")
                  .text(function(d) { return d.name })
                  .style('font-size', '10px');
            },
            linkExtras: function(link) {
                link && link
                  .append("text")
                  .attr("dx", 8)
                  .attr("dy", ".35em")
                  .text(function(d) { return d.value })
                  .style('font-size', '10px');
            }
        }
    };

    $scope.directedData = currencyData;
    */




    $scope.marketOptions = {
        chart: {
            type: 'lineWithFocusChart',
            height: 450,
            margin : {
                top: 20,
                right: 20,
                bottom: 60,
                left: 65
            },
            x: function(d){ 
                return d[0]; 
            },
            y: function(d){ 
                return d[1]; 
            },
            color: d3.scale.category10().range(),
            duration: 1500,
            useInteractiveGuideline: true,
            clipVoronoi: true,
            xAxis: {
                axisLabel: 'Time',
                tickFormat: function(d) {
                    return d3.time.format('%m/%d/%y %H:%M:%S')(new Date(d))
                },
                staggerLabels: true
            },
            yAxis: {
                axisLabel: 'BTC/LTC',
                axisLabelDistance: 50
            }
        }
    };

    $scope.marketGraphData = {};
    $scope.marketGraphData.key = $scope.selectedPair[0]+'_'+$scope.selectedPair[1];
    $scope.marketGraphData.color = '#ff7f0e';
    $scope.marketGraphData.values = [];

    $scope.marketGraphChangeData = {};
    $scope.marketGraphChangeData.key = $scope.selectedPair[0]+'_'+$scope.selectedPair[1] +' Change';
    $scope.marketGraphChangeData.color = '#a94442';
    $scope.marketGraphChangeData.values = [];


    $scope.updateMarketData = function (){
        $scope.marketData.reverse().forEach(function(obj, index){ 
            $scope.marketGraphData.values.push([parseInt(new Date(obj.createdAt).getTime()), obj.price]);
            var change = 0;
            if (index > 1){change = obj.price - $scope.marketData[index-1];}
            $scope.marketGraphChangeData.values.push([parseInt(new Date(obj.createdAt).getTime()), change]);
        });
        //$scope.marketGraphDataRender = [$scope.marketGraphChangeData];
        $scope.marketGraphDataRender = [$scope.marketGraphData];
        //$scope.marketGraphDataRender = [$scope.marketGraphData, $scope.marketGraphChangeData];

    }
    $scope.updateMarketData();
    
    //$scope.marketGraphData.values.push([parseInt(new Date(envelope.data.createdAt).getTime()), envelope.data.price]);
    //$scope.marketGraphDataRender = [$scope.marketGraphData];

    $sailsSocket.subscribe('prediction', function (envelope) {
        switch(envelope.verb) {
            case 'created':
                $scope.predictionData.unshift(envelope.data);
                $scope.updateData();
            case 'updated':
                $scope.updateData();
        }
    });

    $sailsSocket.subscribe('data', function (envelope) {
        switch(envelope.verb) {
            case 'created':
                //console.log(envelope.data);
                if (envelope.data.assetPair==$scope.selectedPair[0]+'_'+$scope.selectedPair[1] && envelope.data.delta == $scope.selectedDelta){
                    console.log(envelope.data);
                    $scope.marketData.push(envelope.data);

                    var change = $scope.marketData[$scope.marketData.length-1].price - $scope.marketData[$scope.marketData.length-2].price
                   
                    console.log(change);

                    $scope.marketGraphData.values.push([parseInt(new Date(envelope.data.createdAt).getTime()), envelope.data.price]);
                    
                    $scope.marketGraphChangeData.values.push([parseInt(new Date($scope.marketData[$scope.marketData.length-1].createdAt).getTime()), change]);

                    //$scope.marketGraphDataRender = [$scope.marketGraphData, $scope.marketGraphChangeData];
                    $scope.marketGraphDataRender = [$scope.marketGraphData]//, $scope.marketGraphChangeData];
                    //$scope.marketGraphDataRender = [$scope.marketGraphChangeData];
                    //$scope.updateMarketData();
                }
                if ($scope.marketData.length >= 300){
                    $scope.marketData.shift();
                    $scope.marketGraphData.values.shift()
                    $scope.marketGraphDataRender = [$scope.marketGraphData]
                }
        }
    });


    //sails.sockets.join(req, 'ticker', function(err) {
        //res.json({});
    //});


    /*
    $sailsSocket.subscribe('ticker', function (envelope) {
        //console.log(envelope);
        $scope.pendingTransactions = envelope;
        $scope.pendingTransactionsList.push(envelope);
        if ($scope.pendingTransactionsList.length >= 100){
            $scope.pendingTransactionsList.shift();
        }
    });
    */



}]);
