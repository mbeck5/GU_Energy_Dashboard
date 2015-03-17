app = module.parent.exports;

var buildingController = require('./controllers/building');
var compQController = require('./controllers/compQuery');

/*Use get for retrieving/viewing information.
  Use post for creating/editing information.
 */

app.get('/api/getBuildings', buildingController.getBuildings); //get
app.get('/api/getBuildingData', buildingController.getResources); //get
app.get('/api/getBuildingDataFromName', buildingController.getResourcesFromName); //get
app.get('/api/getResourceByType', buildingController.getResourcesByType); //get
app.get('/api/getResourceSum', buildingController.getResourceSum); //get
app.get('/api/getBuildingTypes', buildingController.getBuildingTypes); //get
app.get('/api/getCompetitions', compQController.getCompetitions); //get
app.post('/api/saveNewComp', compQController.saveNewComp); //post
app.post('/api/editNewComp', compQController.editNewComp); //post
app.post('/api/deleteComp', compQController.deleteComp); //post
app.post('/api/addCompBuilding', compQController.addCompBuilding); //post
app.post('/api/deleteCompBuildings', compQController.deleteCompBuildings); //post
app.get('/api/getCompBuildingList', compQController.getCompBuildingList); //get
app.get('/api/getBuildingTotals', compQController.getBuildingTotals); //get
