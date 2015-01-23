/**
 * Created by Tyler on 1/22/2015.
 */
describe('controller: buildingDisplay', function () {

  beforeEach(module('clientApp'));

  var scope,
    mockBuildingDisplayCtrl;

  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();

    mockBuildingDisplayCtrl = $controller('BuildingDisplayCtrl', {
      $scope: scope
    });
  }));

  it('should set correct axis label', function () {
    var resource = 3;
    scope.selectResource(resource);
    expect(scope.options.chart.yAxis.axisLabel).toBe('Gas');
  });
});
