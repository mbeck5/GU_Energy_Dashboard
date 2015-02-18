'use strict';

angular.module('clientApp')
  .controller('BuildingDisplayCtrl', function ($scope, $location, $timeout, buildingSvc) {
      var selectedResource = 2; //default resource
      var colorMap = {2: '#FFCC00', 3: '#F20000', 7: '#1F77B4'};
      var unitMap = {2: 'kWh', 3: 'kBTU', 7: 'water units'}; //TODO figure out the water units
      var tempData = [];
      var isDetailed = true; //for switching between monthly and daily data
      $scope.toggleVal = true;  //only used for gui
      $scope.date1 = moment().subtract(1, 'years').format('DD-MMMM-YYYY'); //default start is one year ago
      $scope.date2 = moment().format('DD-MMMM-YYYY');
      $scope.dateOpen1 = false;
      $scope.dateOpen2 = false;
      $scope.selectedBuildings = buildingSvc.getSelectedBuildings();

      checkRefresh();
      getBuildingData(null);  //initial call to get data of default type

      $scope.data = [];

      $scope.options = {
        chart: {
          type: 'lineWithFocusChart',
          height: 600,
          margin: {
            top: 30,
            right: 75,
            bottom: 50,
            left: 75
          },
          xAxis: {
            axisLabel: 'Date',
            showMaxMin: false,
            tickFormat: function(d) {
              return d3.time.format('%m/%d/%y')(new Date(d));
            }
          },
          x2Axis: {
            showMaxMin: false,
            tickFormat: function(d) {
              return d3.time.format('%m/%y')(new Date(d));
            }
          },
          yAxis: {
            axisLabel: 'kWh', //will change with resource toggle
            showMaxMin: false,
            axisLabelDistance: 25,
            tickPadding: [10]
          },
          y2Axis: {
            tickValues: 0,
            showMaxMin: false
          },
          lines: {
            forceY:[0]
          },
          tooltipContent: function(key, x, y, e, graph){
            return '<div>' +
            '<style type="text/css">' +
            '.tg  {border-collapse:collapse;border-spacing:0;border-color:#ccc;}' +
            '.tg td{font-family:Arial, sans-serif;font-size:14px;padding:8px 5px;border-style:solid;border-width:0px;overflow:hidden;word-break:normal;border-color:#ccc;color:#333;background-color:#fff;}' +
            '.tg th{font-family:Arial, sans-serif;font-size:14px;font-weight:normal;border-style:solid;border-width:0px;overflow:hidden;word-break:normal;border-color:#ccc;color:#333;background-color:#f0f0f0;border-bottom-width:2px;border-bottom-color:#f0f0f0}' +
            '.tg .tg-o8k2{font-size:22px;font-family:Arial, Helvetica, sans-serif !important;;background-color:#f9f9f9;text-align:center}' +
            '.tg .tg-431l{font-family:Arial, Helvetica, sans-serif !important;;text-align:center}' +
            '' +
            '</style>' +
            '<table class="tg" style="undefined;">' +
            '<colgroup>' +
            //'<col style="width: 134px">' +
            '</colgroup>' +
            '<tr>' +
            '<th class="tg-o8k2">' + key + '<br></th>' +
            '</tr>' +
            '<tr>' +
            '<td class="tg-431l">' + y + ' ' + unitMap[selectedResource] + ' on ' + x + '</td>' +
            '</tr>' +
            '</table>' +
            '</div>';
          },
          tooltips: true,
          transitionDuration: 500,
          useInteractiveGuideline: true,
          noData: 'No Data Available for Selected Resource'
        },
        title: {
          enable: true,
          text: 'Daily Electricity Usage'
        }
      };

      $scope.selectResource = function (resourceType) {
        resetData();
        selectedResource = resourceType;
        for(var i = 0; i < $scope.selectedBuildings.length; i++) {
          getBuildingData(i);
        }
      };

      //toggles daily and monthly data
      $scope.toggleDetailed = function() {
        isDetailed = !isDetailed;
        resetData();
        getBuildingData();
      };

      //when new date is selected
      $scope.dateChange = function() {
        resetData();
        getBuildingData();
      };

      //toggles date picker visibility
      $scope.openDate = function($event, val) {
        $event.preventDefault();
        $event.stopPropagation();
        if (val === 1) {
          $scope.dateOpen1 = true;
        }
        else {
          $scope.dateOpen2 = true;
        }
      };

      //Changed this to just push to temporary data variable.
      function createGraphData(data){
        var values = [];

        if (data) {
          //create graph points
          values = new Array(data.length);
          for (var j = 0; j < data.length; j++) {
            values[j] = {x: Date.parse(data[j].date), y: data[j].consumption};
          }
        }
        tempData.push({values: values, key: ''});

        //postpone graph initialization until all points have been created
        if(tempData.length === $scope.selectedBuildings.length){
          initGraph();
        }
      }

      function getBuildingData(index) {
        var i = 0;
        var stopCondition = $scope.selectedBuildings.length;
        if(index != null){
          i = index;
          stopCondition = i + 1;
        }
        for(i; i < stopCondition; i++) {
          //if going to building page directly or refreshing, steal name from url (basically a hack)
          if (typeof $scope.selectedBuildings[0].id === 'undefined') {
            var tempName = $location.path().replace('/buildings/', '').replace('--', '/');
            $scope.selectedBuildings[i] = {};
            $scope.selectedBuildings[i].name = tempName;

            //get resource info for building from name rather than ID
            buildingSvc.getBuildingDataFromName(tempName, selectedResource, isDetailed, $scope.date1, $scope.date2).then(function (data) {
              createGraphData(data);
            });
          }

          //if coming from the building select page
          else {
            //get resource info for building
            buildingSvc.getBuildingData($scope.selectedBuildings[i].id, selectedResource, isDetailed, $scope.date1, $scope.date2).then(function (data) {
              createGraphData(data);
            });
          }
        }
      }

      //called once data is retrieved
      function initGraph() {
        //createGraphData(data);
        $scope.data = tempData;
        setKeys();
        setResourceLabel();
        setFocusArea();
        $scope.options.chart.lines.forceY = [0, getMaxPlusPadding(10)];
      }

      //to set the keys for the lines when making multiple lines in a graph. probably bad.
      function setKeys(){
        for(var i = 0; i < $scope.selectedBuildings.length; i++){
          if($scope.data[i]) {
            $scope.data[i].key = $scope.selectedBuildings[i].name;
          }
        }
      }

      function setResourceLabel() {
        $scope.data[0].color = colorMap[selectedResource];
        switch (selectedResource) {
          case 2:
            $scope.options.chart.yAxis.axisLabel = 'kWh';
            if(isDetailed) {
              $scope.options.title.text = 'Daily Electricity Usage';
            }
            else{
              $scope.options.title.text = 'Monthly Electricity Usage';
            }
            break;
          case 3:
            $scope.options.chart.yAxis.axisLabel = 'kBTU';
            if(isDetailed) {
              $scope.options.title.text = 'Daily Gas Usage';
            }
            else{
              $scope.options.title.text = 'Monthly Gas Usage';
            }
            break;
          case 7:
            $scope.options.chart.yAxis.axisLabel = 'Water';
            if(isDetailed) {
              $scope.options.title.text = 'Daily Water Usage';
            }
            else{
              $scope.options.title.text = 'Monthly Water Usage';
            }
            break;
          default:
            $scope.options.chart.yAxis.axisLabel = 'Whatever';
            if(isDetailed) {
              $scope.options.title.text = 'Daily Whatever Usage';
            }
            else{
              $scope.options.title.text = 'Monthly Whatever Usage';
            }
            break;
        }
      }

      //sets initial "zoom" view over specified area
      function setFocusArea() {
        //creating focus coordinates
        var curDate = new Date();
        var prevDate = new Date();
        curDate.setMonth(curDate.getMonth() - 4);   //TODO: change to real values later
        prevDate.setMonth(prevDate.getMonth() - 5);

        //this is actually the right way to do this
        $timeout(function() {
          var chart = $scope.api.getScope().chart;  //get chart from view
          chart.brushExtent([prevDate, curDate]);
          $scope.api.update();
        });
      }

      function checkRefresh() {
        //if routing directing to comparison, go back home
        if (buildingSvc.getSelectedBuildings()[0] === 'DESELECTED' && $location.path() === '/comparison') {
          $location.path('/');
        }
      }

      //Returns the max y value of all datasets in $scope.data
      function getMaxPlusPadding(denom){
        var max = 0;
        for(var i = 0; i < $scope.selectedBuildings.length; i++){
          if($scope.data[i]) {
            var data = $scope.data[i].values;
            for (var j = 0; j < data.length; j++) {
              if (data[j].y > max) {
                max = data[j].y;
              }
            }
          }
        }
        var padding = max / denom;
        return max + padding;
      }

      //clears all data
      function resetData() {
        $scope.data = [];
        tempData = [];
      }
  });
