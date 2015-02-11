app = module.parent.exports;

var siteController = require('./controllers/site');
var compQController = require('./controllers/compQuery');

app.get('/api/getBuildings', siteController.getBuildings);
app.get('/api/getBuildingData', siteController.getResources);
app.get('/api/getBuildingDataFromName', siteController.getResourcesFromName);
app.get('/api/getResourceByType', siteController.getResourcesByType);
app.get('/api/getResourceSum', siteController.getResourceSum);
app.get('/api/getBuildingTypes', siteController.getBuildingTypes);
app.get('/api/getCompetitions', compQController.getCompetitions);
app.get('/api/saveNewComp', compQController.saveNewComp);
app.get('/api/editNewComp', compQController.editNewComp);
app.get('/api/deleteComp', compQController.deleteComp);
