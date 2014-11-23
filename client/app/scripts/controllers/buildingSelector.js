'use strict';

angular.module('clientApp')
  .controller('BuildingSelectorCtrl', function ($scope, buildingSvc) {
    var buildings = [];

    var electricityTips = ["Etip1", "Etip2", "Etip3"];
    var gasTips = ["Gtip1", "Gtip2", "Gtip3"];
    var waterTips = ["Wtip1", "Wtip2", "Wtip3"];

    $scope.searchInput = '';
    $scope.filteredBuildings = [];

    jQuery(document).ready(function() {
      jQuery('.tabs .tab-links a').on('click', function(e)  {
        var currentAttrValue = jQuery(this).attr('href');

        // Show/Hide Tabs
        jQuery('.tabs ' + currentAttrValue).show().siblings().hide();

        // Change/remove current tab to active
        jQuery(this).parent('li').addClass('active').siblings().removeClass('active');

        e.preventDefault();
      });
    });

    //unpack promise returned from rest call
    buildingSvc.getBuildings().then(function (data) {
      buildings = data;
      $scope.filteredBuildings = buildings;
    });

    var windowHeight = $(window).height();
    var windowWidth = $(window).width();

    var buildingScrollHeight = $(window).height() * .55;
    $('.scroll').css({'height': buildingScrollHeight + 'px'});

    var tipTextWidth = $(window).width() * .25;
    $('.tipText').css({'width': tipTextWidth  + 'px'});

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
