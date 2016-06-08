'use strict';

angular.module('cApp').service('ShortestPathService', function(){
    this.get = function(nodes, edge) {
        console.log(nodes);
        console.log(edge);
        var known = [];
        var weight = [];
        known.push(true);
        weight.push(0);
        for (var i = 1; i < nodes.length; ++i){
            known.push(false);
            weight.push(nodes.length);
        }

    }
});
