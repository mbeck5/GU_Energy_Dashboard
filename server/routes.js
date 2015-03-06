app = module.parent.exports;

var buildingController = require('./controllers/building');
var compQController = require('./controllers/compQuery');

app.get('/api/getBuildings', buildingController.getBuildings);
app.get('/api/getBuildingData', buildingController.getResources);
app.get('/api/getBuildingDataFromName', buildingController.getResourcesFromName);
app.get('/api/getResourceByType', buildingController.getResourcesByType);
app.get('/api/getResourceSum', buildingController.getResourceSum);
app.get('/api/getBuildingTypes', buildingController.getBuildingTypes);
app.get('/api/getCompetitions', compQController.getCompetitions);
app.get('/api/saveNewComp', compQController.saveNewComp);
app.get('/api/editNewComp', compQController.editNewComp);
app.get('/api/deleteComp', compQController.deleteComp);
app.get('/api/addCompBuilding', compQController.addCompBuilding);
app.get('/api/deleteCompBuildings', compQController.deleteCompBuildings);
app.get('/api/getCompBuildingList', compQController.getCompBuildingList);
app.get('/api/getBuildingTotals', compQController.getBuildingTotals);
