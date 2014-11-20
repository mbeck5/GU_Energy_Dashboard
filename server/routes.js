app = module.parent.exports;

var siteController = require('./controllers/site');

app.get('/api/getBuildings', siteController.getBuildings);
app.get('/api/getBuildingData', siteController.getResources);