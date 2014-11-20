'use strict';

angular.module('clientApp')
  .controller('BuildingSelectorCtrl', function ($scope, buildingSvc) {
    var buildings = [];
    $scope.searchInput = '';
    $scope.filteredBuildings = [];

    //unpack promise returned from rest call
    buildingSvc.getBuildings().then(function (data) {
      buildings = data;
      $scope.filteredBuildings = buildings;
    });

    var buildingScrollHeight = $(window).height() * .65;
    $('.scroll').css({'height': buildingScrollHeight + 'px'});

    //filters based on search input
    $scope.filterBuildings = function () {
      $scope.filteredBuildings = buildings.filter(filterBuildings);
    };

    //when clicking on building
    $scope.selectBuilding = function (index) {
      buildingSvc.setSelectedBuilding($scope.filteredBuildings[index]);
    };

    function filterBuildings(element) {
      return element.name.toLowerCase().indexOf($scope.searchInput.toLowerCase().trim()) > -1;
    }
  });
