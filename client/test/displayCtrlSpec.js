/**
 * Created by Tyler on 1/22/2015.
 */
describe('controller: buildingDisplay', function () {

  beforeEach(module('clientApp'));

  var scope,
    buildingDisplayCtrl,
    deferred,
    mockBuildingSvc,
    data = [];

  beforeEach(inject(function ($rootScope, $controller, $q) {
    scope = $rootScope.$new();
    mockBuildingSvc = {
      getSelectedBuilding: function() {
        return 'Alliance';
      },
      getBuildingData: function() {
        deferred = $q.defer();
        return deferred.promise;
      }
    };

    buildingDisplayCtrl = $controller('BuildingDisplayCtrl', {
      $scope: scope,
      buildingSvc: mockBuildingSvc
    });
  }));

  it('should set correct axis label', function () {
    var resource = 3;
    scope.selectResource(resource);
    deferred.resolve(data);
    scope.$root.$digest();
    expect(scope.options.chart.yAxis.axisLabel).toBe('Gas');
  });
});
