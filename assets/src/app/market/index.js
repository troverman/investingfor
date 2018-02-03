angular.module( 'investing.market', [
])

.config(['$stateProvider', function config( $stateProvider ) {
	$stateProvider.state( 'market', {
		url: '/market/:path1/:path2',
		views: {
			"main": {
				controller: 'MarketCtrl',
				templateUrl: 'market/index.tpl.html'
			}
		},
        resolve:{
            marketData: ['$stateParams', 'DataModel', function($stateParams, DataModel) {
                return DataModel.getData(1000, 0, 'createdAt DESC', $stateParams.path1.toUpperCase(), $stateParams.path2.toUpperCase(), 300000);
                //return null
            }]
        }
	});
}])

.controller( 'MarketCtrl', ['$rootScope', '$sailsSocket', '$scope', '$stateParams', 'AnalysisModel', 'config', 'DataModel', 'marketData', 'PredictionModel', 'titleService', function MarketController( $rootScope, $sailsSocket, $scope, $stateParams, AnalysisModel, config, DataModel, marketData, PredictionModel, titleService ) {
	
    //TODO: live price.. ticker call -- socket. --> in title!
    titleService.setTitle($stateParams.path1.toUpperCase()+'/'+$stateParams.path2.toUpperCase()+' - investingfor');

    $scope.marketData = marketData;
    $scope.stateParams = $stateParams;
    $scope.selectedPair = [$stateParams.path1.toUpperCase(),$stateParams.path2.toUpperCase()];
    $scope.selectedDelta = '300000';

    //TODO: HIGH CHARTS
    $scope.marketOptions = {
        chart: {
            type: 'lineWithFocusChart',
            height: 500,
            margin : {
                top: 20,
                right: 0,
                bottom: 40,
                left: 40
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
                axisLabel: $scope.selectedPair[0]+'_'+$scope.selectedPair[1],
                axisLabelDistance: 50
            }
        }
    };

    $scope.marketGraphData = {};
    $scope.marketGraphData.key = $scope.selectedPair[0]+'_'+$scope.selectedPair[1];
    $scope.marketGraphData.color = '#14b794';
    $scope.marketGraphData.values = [];

    $scope.marketGraphChangeData = {};
    $scope.marketGraphChangeData.key = $scope.selectedPair[0]+'_'+$scope.selectedPair[1] +' Change';
    $scope.marketGraphChangeData.color = '#a94442';
    $scope.marketGraphChangeData.values = [];

    $scope.marketGraphChangeChangeData = {};
    $scope.marketGraphChangeChangeData.key = $scope.selectedPair[0]+'_'+$scope.selectedPair[1] +' Change Change';
    $scope.marketGraphChangeChangeData.color = '#f94442';
    $scope.marketGraphChangeChangeData.values = [];


    $scope.selectedClass= function(delta){
        if($scope.selectedDelta==delta){return 'btn btn-primary'}
        else{return 'btn btn-default'}
    }

    //TODO: REFACTOR
    var heatmapData = {};
    heatmapData.labels = [];
    heatmapData.labels = ['Time1','Time2','Time3','Time4','Time5','Time6','Time7','Time8','Time9','Time10','Time11','Time12','Time13','Time14','Time15','Time16','Time17','Time18','Time19','Time20','Time21','Time22','Time23','Time24','Time25', 'Time26'],
    //for(var i = 0; i<=100; i++){
    //   heatmapData.labels.push('Time'+i);
    //}
    heatmapData.datasets = [];
    $scope.clientWidth = document.body.clientWidth;
    for(var i = 25; i>=-25; i--){
        var dataInsert = 0;
        if (i == 0){dataInsert = 100}
        else if (i == 1 || i == -1){dataInsert = 75}
        else{dataInsert = Math.abs(parseInt( 1/i * 100 ))}
        //var dataSet = [];
        //for(var i = 0; i<=100; i++){
        //    dataSet.push(dataInsert);
        //}
        //heatmapData.datasets.push({label:(1*i).toString(), data:[dataSet]})
        heatmapData.datasets.push({label:(1*i).toString(), data:[dataInsert,dataInsert,dataInsert,dataInsert,dataInsert,dataInsert,dataInsert,dataInsert,dataInsert,dataInsert,dataInsert,dataInsert,dataInsert,dataInsert,dataInsert,dataInsert,dataInsert,dataInsert,dataInsert,dataInsert,dataInsert,dataInsert,dataInsert,dataInsert,dataInsert,dataInsert]})
    }

    var ctx = document.getElementById('tableHeatmap').getContext('2d');
    var heatmapOptions = {rounded: false, showLabels: false};
    var newChart = new Chart(ctx).HeatMap(heatmapData, heatmapOptions);

    //TODO: LOL
    $scope.getPdf = function (){
        $rootScope.stateIsLoading = true;
        //$scope.marketData.reverse().slice($scope.marketData.length-350, $scope.marketData.length)
        AnalysisModel.getPdf($scope.marketData.slice(0,350)).then(function(returnData){
            
            //console.log(returnData);
            var heatmapData = {};
            var pdfData = returnData.heatMap.slice(returnData.heatMap.length-100, returnData.heatMap.length);
            heatmapData.labels = [];
            heatmapData.datasets = [];

            for(x in pdfData){
                heatmapData.labels.push(x);//$scope.marketData[x].createdAt);
            }
            var sortedKeys = Object.keys(pdfData[0]).sort(function(a,b){return b - a})
            for (x in sortedKeys){ 
                var dataArray = [];
                var key = sortedKeys[x];
                if (key < 0.20 && key > -0.20){
                    for (z in pdfData){
                        dataArray.push(pdfData[z][key]*1000);
                    }
                    heatmapData.datasets.push({label:key, data:dataArray})
                }
            }

            console.log(heatmapData);
            var ctx = document.getElementById('tableHeatmap').getContext('2d');
            var heatmapOptions = {rounded: false, showLabels: false};
            var newChart = new Chart(ctx).HeatMap(heatmapData, heatmapOptions);
            $rootScope.stateIsLoading = false;

        });
    };
    //$scope.getPdf();

    $scope.getEma = function (periodArray, type){
        $rootScope.stateIsLoading = true;
        var periodArray = periodArray;
        for(x in periodArray){
            (function(x, periodArray) {
                AnalysisModel.getEma($scope.marketData, periodArray[x], type).then(function(emaData){
                    console.log(emaData);
                    var emaGraphData = {}
                    emaGraphData.key = 'EMA_'+periodArray[x];
                    emaGraphData.color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
                    emaGraphData.values = emaData;
                    $scope.marketGraphDataRender.push(emaGraphData);
                    //$scope.marketGraphChangeDataRender.push(emaGraphData);
                    //$scope.marketGraphChangeChangeDataRender.push(emaGraphData);
                    $rootScope.stateIsLoading = false;
                });
            })(x, periodArray);
        }
    };
    //$scope.getEma([3,5,10,20,40,80,160,320,640,1000], 'price');

    $scope.getTsf = function (periodArray){
        $rootScope.stateIsLoading = true;
        var periodArray = [3,5,10,20,40,80,160,320,640,1000];
        for(x in periodArray){
        //for (var x=1; x <= 100; x++){
            (function(x, periodArray) {
                //AnalysisModel.getTsf($scope.marketData.reverse(), x).then(function(tsfData){
                AnalysisModel.getTsf($scope.marketData, periodArray[x]).then(function(tsfData){
                    console.log(tsfData);
                    var tsfGraphData = {}
                    //tsfGraphData.key = 'TSF_'+x;
                    tsfGraphData.key = 'TSF_'+periodArray[x];
                    tsfGraphData.color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
                    tsfGraphData.values = tsfData;
                    $scope.marketGraphDataRender.push(tsfGraphData);
                    //$scope.marketGraphChangeDataRender.push(tsfGraphData);
                    //$scope.marketGraphChangeChangeDataRender.push(tsfGraphData);
                    $rootScope.stateIsLoading = false;
                });
            })(x, periodArray);
        }
    };
    //$scope.getTsf([3,5,10,20,40,80,160,320,640,1000]);

    //TODO:BACKEND
    //TODO: WTF THE SHIFT?????
    $scope.getBband = function (periodArray, sdArray, type){
        //$scope.updateMarketData(function(){
        //});
        $rootScope.stateIsLoading = true;
        var periodArray = periodArray;
        var sdArray = sdArray;
        var data = $scope.marketData;
        for(x in periodArray){
            for(y in sdArray){
                (function(x, y, periodArray, sdArray) {
                    console.log(periodArray[x], sdArray[y])
                    AnalysisModel.getBband(data, periodArray[x], sdArray[y], type).then(function(bbandData){
                        var bbandUpperGraphData = {};
                        var bbandMiddleGraphData = {};
                        var bbandLowerGraphData = {};
                        bbandUpperGraphData.key = 'UB_'+periodArray[x]+'_'+sdArray[y];
                        //bbandMiddleGraphData.key = 'bband_middle_'+x/10//periodArray[x];
                        bbandLowerGraphData.key = 'LB_'+periodArray[x]+'_'+sdArray[y];
                        //emaGraphData.color = ('#14b79'+x.toString()).toString(16);
                        bbandUpperGraphData.color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
                        //bbandMiddleGraphData.color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
                        bbandLowerGraphData.color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
                        bbandUpperGraphData.values = bbandData.upper;
                        //bbandMiddleGraphData.values = bbandData.middle;
                        bbandLowerGraphData.values = bbandData.lower;
                        console.log(bbandData);

                        if (type=='price'){
                            $scope.marketGraphDataRender.push(bbandUpperGraphData);
                            //$scope.marketGraphDataRender.push(bbandMiddleGraphData);
                            $scope.marketGraphDataRender.push(bbandLowerGraphData);
                        }
                        if (type=='change'){
                            $scope.marketGraphChangeDataRender.push(bbandUpperGraphData);
                            //$scope.marketGraphChangeDataRender.push(bbandMiddleGraphData);
                            $scope.marketGraphChangeDataRender.push(bbandLowerGraphData);
                        }
                        if (type=='changeChange'){
                            $scope.marketGraphChangeChangeDataRender.push(bbandUpperGraphData);
                            //$scope.marketGraphChangeChangeDataRender.push(bbandMiddleGraphData);
                            $scope.marketGraphChangeChangeDataRender.push(bbandLowerGraphData);
                        }
                        $rootScope.stateIsLoading = false;
                    });
                })(x, y, periodArray, sdArray);
            }
        }
    };
    //$scope.getBband([5,10,15,20], [2,2.5,3,3.5], 'price');
    //$scope.getBband([5,10,15], [0.5,1,1.5,2,2.5,3,3.5], 'price');
    //$scope.getBband([2,4,6,8,10,12,14,16,18,20], [2], 'price');
    //$scope.getBband([5,10,15], [0.5,1,1.5,2,2.5,3,3.5,4,4.5,5,5.5,6,6.5,7], 'price');


    //TODO: DO IT
    $scope.getNn = function (periodArray, sdArray){}
    //$scope.getNn();
    //$scope.getNnPdf = function (periodArray, sdArray){}
    //$scope.getNnPdf();

    //TODO: REFACTOR
    $scope.updateMarketData = function (callback){
        $rootScope.stateIsLoading = true;
        $scope.marketData.reverse().forEach(function(obj, index){ 
            $scope.marketGraphData.values.push([parseInt(new Date(obj.createdAt).getTime()), obj.price]);
            $scope.marketGraphChangeData.values.push([parseInt(new Date(obj.createdAt).getTime()), obj.percentChange]);
            var change = 0;
            var changeChange = 0
            if (index > 1){
                change = obj.price - $scope.marketData[index-1].price;
                change = change/obj.price;
            }

            //$scope.marketGraphChangeData.values.push([parseInt(new Date(obj.createdAt).getTime()), change]);
            if ($scope.marketGraphChangeData.values.length > 1){
                changeChange = $scope.marketGraphChangeData.values[$scope.marketGraphChangeData.values.length-1][1] - $scope.marketGraphChangeData.values[$scope.marketGraphChangeData.values.length-2][1];
                //changeChange = changeChange / $scope.marketGraphChangeData.values[$scope.marketGraphChangeData.values.length-1][1]
            }
            $scope.marketGraphChangeChangeData.values.push([parseInt(new Date(obj.createdAt).getTime()), changeChange]);
        });

        $scope.marketGraphDataRender = [$scope.marketGraphData]
        $scope.marketGraphChangeDataRender = [$scope.marketGraphChangeData]
        $scope.marketGraphChangeChangeDataRender = [$scope.marketGraphChangeChangeData];
        //RENDER INDICATORS~~
        $rootScope.stateIsLoading = false;
        callback();
    };

    $scope.updateMarketData(function(){
        //$scope.getBband([500, 750], [0.5, 1, 2, 4, 6, 8], 'price');
        $scope.getBband([50, 100], [2], 'change');
        $scope.getEma([160, 320], 'price');
        $scope.getBband([10], [2], 'change');
    });


    $scope.selectData = function (asset1, asset2, delta){
        $rootScope.stateIsLoading = true;
        $scope.selectedPair = [asset1.toUpperCase(), asset2.toUpperCase()];
        $scope.selectedDelta = delta;
        //if $scope.selectedDelta != delta
        DataModel.getData(1000, 0, 'createdAt DESC', asset1.toUpperCase(), asset2.toUpperCase(), delta).then(function(model){
            $scope.marketGraphData.values = [];
            $scope.marketGraphChangeData.values = [];
            $scope.marketGraphChangeChangeData.values = [];
            //TODO: reverse prob.
            $scope.marketData = model;
            $scope.updateMarketData();
            $rootScope.stateIsLoading = false;
        })
    };


    //TODO: LIVE PRICE
    //TODO: DECENTRALIZE
    //$sailsSocket.subscribe('ticker', function (envelope) {
    //    $scope.currentPrice = envelope.data
    //});

    //TODO: REFACTOR
    $sailsSocket.subscribe('data', function (envelope) {
        switch(envelope.verb) {
            case 'created':
                //console.log(envelope.data);
                if (envelope.data.assetPair==$scope.selectedPair[0]+'_'+$scope.selectedPair[1] && envelope.data.delta == $scope.selectedDelta){
                    
                    $scope.marketData.push(envelope.data);

                    var change = $scope.marketData[$scope.marketData.length-1].price - $scope.marketData[$scope.marketData.length-2].price;
                    change = change/$scope.marketData[$scope.marketData.length-1].price
                    $scope.marketGraphData.values.push([parseInt(new Date(envelope.data.createdAt).getTime()), envelope.data.price]);
                    $scope.marketGraphChangeData.push(envelope.data.percentChange);
                    //$scope.marketGraphChangeData.values.push([parseInt(new Date($scope.marketData[$scope.marketData.length-1].createdAt).getTime()), change]);

                    var changeChange = $scope.marketGraphChangeData.values[$scope.marketGraphChangeData.values.length-1][1] - $scope.marketGraphChangeData.values[$scope.marketGraphChangeData.values.length-2][1];
                    $scope.marketGraphChangeChangeData.values.push([parseInt(new Date($scope.marketData[$scope.marketData.length-1].createdAt).getTime()), changeChange]);

                    $scope.marketGraphDataRender = [$scope.marketGraphData]
                    $scope.marketGraphChangeDataRender = [$scope.marketGraphChangeData];
                    $scope.marketGraphChangeChangeDataRender = [$scope.marketGraphChangeChangeData];

                }
                if ($scope.marketData.length >= 1000){
                    $scope.marketData.shift();
                    $scope.marketGraphData.values.shift()
                    $scope.marketGraphDataRender = [$scope.marketGraphData];
                    $scope.marketGraphChangeDataRender = [$scope.marketGraphChangeData];
                    $scope.marketGraphChangeChangeDataRender = [$scope.marketGraphChangeChangeData];
                }
        }
    });


}]);