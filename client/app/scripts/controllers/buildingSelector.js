'use strict';

angular.module('clientApp')
  .controller('BuildingSelectorCtrl', function ($scope, $location, buildingSvc) {
    var buildings = [];
    $scope.searchInput = '';
    $scope.buildingTypes = [];
    $scope.filteredBuildings = [];
    $scope.checkedBuildings = [];
    $scope.compareEnabled = false;
    $scope.comparisonText = 'Select Multiple';    //dynamic text for compare button

    //get list of buildings
    buildingSvc.getBuildings().then(function (data) {
      buildings = data;
      $scope.filteredBuildings = buildings;
    });

    //get list of building types
    buildingSvc.getBuildingTypes().then(function (data) {
      $scope.buildingTypes = data;
    });

    //filters based on search input
    $scope.filterBuildingsBySearch = function () {
      $scope.filteredBuildings = buildings.filter(function (element) {
        return element.name.toLowerCase().indexOf($scope.searchInput.toLowerCase().trim()) > -1;
      });
    };

    $scope.filterBuildingsByType = function (type) {
      $scope.searchInput = "";  //clear the search bar
      $scope.filteredBuildings = buildings.filter(function (element) {
        return type === 1 || element.buildingTypeId === type;
      });
    };

    //when clicking on building
    $scope.selectBuilding = function (index) {
      //don't go to building page if comparison enabled
      if (!$scope.compareEnabled) {
        buildingSvc.setSelectedBuilding([$scope.filteredBuildings[index]]);
        $location.path('buildings/' + returnCorrectName(index));   //change to building route
      }
      //toggle check if comparison enabled
      else {
        var id = $scope.filteredBuildings[index].id;
        if ($scope.checkedBuildings[id]) {
          $scope.checkedBuildings[id] = !$scope.checkedBuildings[id];
        }
        else {
          $scope.checkedBuildings[id] = true;
        }
      }
    };

    //can't have '/' in url
    function returnCorrectName(index) {
        return $scope.filteredBuildings[index].name.replace("/", "--");
    }

    //when selecting the 'X' button after 'Select Multiple' was pressed
    $scope.disableComparison = function() {
      $scope.compareEnabled = false;
      $scope.comparisonText = 'Select Multiple';
      $scope.checkedBuildings = []; //reset checked buildings
    };

    //action for when user selects the Compare/select multiple button
    $scope.comparisonSelect = function() {
      if ($scope.comparisonSelectable()) {
        //if compare already enabled, compare!
        if ($scope.compareEnabled) {
          var tempList = [];

          //add building ids marked as true to list
          for (var property in $scope.checkedBuildings) {
            if ($scope.checkedBuildings.hasOwnProperty(property) && $scope.checkedBuildings[property]) {
              tempList.push({id: property, name: findNameById(property)});
            }
          }
          buildingSvc.setSelectedBuilding(tempList);  //save checked buildings to service
          $location.path('comparison'); //navigate to comparison path
        }
        //enter compare mode
        else {
          $scope.compareEnabled = !$scope.compareEnabled;
          $scope.comparisonText = 'Compare';
        }
      }
    };

    //return true if the comparison/select multiple button is selectable
    $scope.comparisonSelectable = function() {
      //always return true if comparison isn't enabled
      if (!$scope.compareEnabled) {
        return true;
      }
      else {
        var count = 0;
        //iterate over properties which are buildings
        for (var property in $scope.checkedBuildings) {
          if ($scope.checkedBuildings.hasOwnProperty(property) && $scope.checkedBuildings[property]) {
            count++;
          }
        }
        return count >= 2;
      }
    };

    //return name of building based on id
    function findNameById(id) {
      for (var i = 0; i < buildings.length; ++i) {
        if (buildings[i].id === parseInt(id)) {
          return buildings[i].name;
        }
      }
      return "";
    }
  });
