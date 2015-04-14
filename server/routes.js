app = module.parent.exports;

var buildingController = require('./controllers/building');
var compQController = require('./controllers/compQuery');
var loginController = require('./controllers/login');

app.get('/api/getBuildings', buildingController.getBuildings);
app.get('/api/getBuildingData', buildingController.getResources);
app.get('/api/getBuildingDataFromName', buildingController.getResourcesFromName);
app.get('/api/getResourceByType', buildingController.getResourcesByType);
app.get('/api/getResourceSum', buildingController.getResourceSum);
app.get('/api/getBuildingTypes', buildingController.getBuildingTypes);
app.get('/api/getCompetitions', compQController.getCompetitions);
app.post('/api/saveNewComp', compQController.saveNewComp);
app.post('/api/editNewComp', compQController.editNewComp);
app.post('/api/deleteComp', compQController.deleteComp);
app.post('/api/addCompBuilding', compQController.addCompBuilding);
app.post('/api/deleteCompBuildings', compQController.deleteCompBuildings);
app.get('/api/getCompBuildingList', compQController.getCompBuildingList);
app.get('/api/getBuildingTotals', compQController.getBuildingTotals);
app.get('/api/getUser', loginController.getUser);
app.get('/api/getPassword', loginController.getPassword);
app.post('/api/addUser', loginController.addUser);
