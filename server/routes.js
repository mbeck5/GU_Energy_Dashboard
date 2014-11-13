app = module.parent.exports;

var siteController = require('./controllers/site');

app.get('/api/buildings', siteController.getBuildings);