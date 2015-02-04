app = module.parent.exports;

var siteController = require('./controllers/site');

app.get('/api/getBuildings', siteController.getBuildings);
app.get('/api/getBuildingData', siteController.getResources);
app.get('/api/getBuildingDataFromName', siteController.getResourcesFromName);
app.get('/api/getResourceByType', siteController.getResourcesByType);
app.get('/api/getResourceSum', siteController.getResourceSum);
app.get('/api/getBuildingTypes', siteController.getBuildingTypes);
app.get('/api/getCompetitions', siteController.getCompetitions);