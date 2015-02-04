app = module.parent.exports;

var buildingController = require('./controllers/building');

app.get('/api/getBuildings', buildingController.getBuildings);
app.get('/api/getBuildingData', buildingController.getResources);
app.get('/api/getBuildingDataFromName', buildingController.getResourcesFromName);
app.get('/api/getResourceByType', buildingController.getResourcesByType);
app.get('/api/getResourceSum', buildingController.getResourceSum);
app.get('/api/getBuildingTypes', buildingController.getBuildingTypes)