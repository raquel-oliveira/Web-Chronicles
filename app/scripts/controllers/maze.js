'use strict';

/**
 * @ngdoc function
 * @name cApp.controller:MazeCtrl
 * @description
 * # MazeCtrl
 */
angular.module('cApp')
    .controller('MazeCtrl', function ($scope) {
      function shuffle(array) {
        var cpt = array.length;

        while (cpt) {
          var pos = Math.floor(Math.random() * cpt);
          cpt--;
          var tmp = array[cpt];
          array[cpt] = array[pos];
          array[pos] = tmp;
        }
      }

      function generateMaze(nbRows, nbCols) {
        var maze = [];
        var edges = [];

        // Initializes edges
        for (var i = 0; i < nbRows * nbCols; ++i){
          if ( ((i + 1) % nbCols) !== 0){
            edges.push({ x : i, y : i + 1});
          }
        }
        for (var j = 0; j + nbCols < nbRows * nbCols; ++j){
          edges.push({ x : j, y : j + nbCols });
        }

        shuffle(edges);

        // Initialize maze
        let { Universe } = fixeddisjointset.LinkedList;
        var ds = new Universe(nbRows * nbCols);
        var numSet = nbRows * nbCols;

        while (numSet > 1) {
          var e = edges.shift();
          var rx = ds.find(e.x);
          var ry = ds.find(e.y);
          if (rx !== ry) {
            ds.union(rx, ry); --numSet;
          } else {
            maze.push(e);
          }
        }

        while (edges.length > 0) {
          maze.push(edges.shift());
        }

        return maze;
      }

	$scope.endReached = false;
	$scope.nbRows = parseInt($scope.currentStep.rows);
	$scope.nbCols = parseInt($scope.currentStep.columns);
	$scope.player = { x : 0, y : 0 };
	$scope.end = { x : $scope.nbCols - 1, y : $scope.nbRows - 1 };

	$scope.grid = new Array($scope.nbRows);
	$scope.maze = generateMaze($scope.nbRows, $scope.nbCols);

	for (var i = 0; i < $scope.nbRows; ++i) {
	    $scope.grid[i] = [];
	    for (var j = 0; j < $scope.nbCols; ++j) {
		$scope.grid[i].push(i * $scope.nbCols + j);
	    }
	}


	//console.log('foo');

	$scope.getStyle = function(cell) {
	    var style = { 'height' : '20px',
			  'width'  : '20px' };
	    var hasRight = false, hasBottom = false;
/*
	    if ($scope.translate($scope.end.x, $scope.end.y)  === cell) {
		style['background-color'] = 'green';
	    }
*/
	    if ($scope.translate($scope.player.x, $scope.player.y)  === cell) {
		style['background-color'] = 'red';
	    }

	    // display borders
	    for (var i = 0; i < $scope.maze.length; ++i) {
		if ($scope.maze[i].x === cell) {
		    if ($scope.maze[i].y === cell + 1)
			style['border-right'] = '1px dashed black';

		    if ($scope.maze[i].y === cell + $scope.nbCols)
			style['border-bottom'] = '1px dashed black';
		}
	    }

	    return style;
	}

	$scope.handleKey = function($event) {
	    if ($scope.endReached) return;

	    if ($event.keyCode === 40) {
		if ($scope.player.y < $scope.nbRows - 1 &&
		    ! $scope.isWall($scope.translate($scope.player.x, $scope.player.y),
				    $scope.translate($scope.player.x, $scope.player.y + 1))) {
		    $scope.player.y += 1;
		}
  } else if ($event.keyCode === 38) {
		if ($scope.player.y > 0 &&
		    ! $scope.isWall($scope.translate($scope.player.x, $scope.player.y),
				    $scope.translate($scope.player.x, $scope.player.y - 1))) {
		    $scope.player.y -= 1;
		}
  } else if ($event.keyCode === 37) {
		if ($scope.player.x > 0 &&
		    ! $scope.isWall($scope.translate($scope.player.x, $scope.player.y),
				    $scope.translate($scope.player.x - 1, $scope.player.y))) {
		    $scope.player.x -= 1;
		}
  } else if ($event.keyCode === 39) {
		if ($scope.player.x < $scope.nbCols - 1 &&
		    ! $scope.isWall($scope.translate($scope.player.x, $scope.player.y),
				    $scope.translate($scope.player.x + 1, $scope.player.y))) {
		    $scope.player.x += 1;
		}
	    }

	    if ($scope.player.x === $scope.end.x &&
	        $scope.player.y === $scope.end.y)
		$scope.endReached = true;
	}

	$scope.isWall = function(x, y) {
	    for (var i = 0; i < $scope.maze.length; ++i) {
		if (($scope.maze[i].x === x && $scope.maze[i].y == y) ||
		    ($scope.maze[i].x === y && $scope.maze[i].y == x))
		    return true;
	    }

	    return false;
	}

	$scope.translate = function(x, y) {
	    return y * $scope.nbCols + x;
	}

	$scope.nextStep = function() {
	    //console.log();
	    $scope.goToStep();
	}
    });
