angular.module('models.data', ['lodash', 'services', 'sails.io',])

.service('DataModel', ['$sailsSocket', 'utils', function($sailsSocket, utils) {
    this.getAll = function() {
        var url = utils.prepareUrl('data');
        return $sailsSocket.get(url).then(success, error);
    };

    this.getData = function(limit, skip, sort, asset1, asset2, delta) {
        var query = {params:{limit: limit, skip: skip, sort: sort, asset1: asset1, asset2: asset2, delta: delta}};
        var url = utils.prepareUrl('data');
        return $sailsSocket.get(url, query).then(success, error);
    };

    this.getCurrency = function() {
        var url = utils.prepareUrl('data/currency');
        return $sailsSocket.get(url).then(success, error);
    };

    this.delete = function(model) {
        var url = utils.prepareUrl('post/' + model.id);
        return $sailsSocket.delete(url).then(success, error);
    };

    var success = function(response) {
        return response.data;
    };

    var error = function(error) {
        console.log(error);
    };
}]);