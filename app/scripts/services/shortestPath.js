angular.module('cApp').service('ShortestPathService', function(){
    this.get = function(nodes, edge) {
        console.log(nodes);
        console.log(edge);
    }
});