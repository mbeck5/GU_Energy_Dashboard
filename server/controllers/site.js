var stdDev = require('../services/standardDeviation');

exports.getBuildings = function(req, res){
    connection.query("SELECT DISTINCT BUILDING_NAME AS name, BUILDING_ID as id, BUILDING_TYPE_ID as buildingTypeId FROM building WHERE BUILDING_NAME != 'undefined' ORDER BY BUILDING_NAME", function(err, rows){
        if(err){
            throw err;
        }
        else {
            res.send(rows);
        }
    });
};

exports.getResources = function(req, res){
    var queryString = "SELECT meters_dly_data.trend_date as date, meters_dly_data.consumption " +
                    "FROM meters_dly_data " +
                    "JOIN meters ON meters_dly_data.METER_ID=meters.METER_ID " +
                    "WHERE meter_type_id = " + req.param("meterType") + " AND meters.meter_id IN (SELECT METER_ID " +
                                                "FROM erb_tree " +
                                                "WHERE PARENT_NODE_ID IN (SELECT NODE_ID " +
                                                                            "FROM erb_tree " +
                                                                            "WHERE BUILDING_ID = " + req.param("building") + ")) ORDER BY date;";

    connection.query(queryString, function(err, rows){
        if(err){
            throw err;
        }
        else {
            res.send(stdDev.standardDeviationFilter(rows));
        }
    });
};

exports.getResourcesFromName = function(req, res) {
    var queryString = "SELECT meters_dly_data.trend_date as date, meters_dly_data.consumption " +
                    "FROM meters_dly_data " +
                    "JOIN meters ON meters_dly_data.METER_ID=meters.METER_ID " +
                    "WHERE meter_type_id = " + req.param("meterType") + " AND meters.meter_id IN (SELECT METER_ID " +
                                                "FROM erb_tree " +
                                                "WHERE PARENT_NODE_ID IN (SELECT NODE_ID " +
                                                                            "FROM erb_tree " +
                                                                            "WHERE BUILDING_ID IN (SELECT building_id " +
                                                                                                    "FROM building " +
                                                                                                    "WHERE building_name = '" + req.param("building") + "'))) ORDER BY date;";

    connection.query(queryString, function(err, rows){
        if(err){
            throw err;
        }
        else {
            res.send(stdDev.standardDeviationFilter(rows));
        }
    });
};

exports.getBuildingTypes = function(req, res) {
    var queryString = "SELECT building_type_id as buildingTypeId, building_type as buildingType " +
                    "FROM building_type;";

    connection.query(queryString, function(err, rows) {
        if(err) {
            throw err;
        }
        else {
            res.send(rows);
        }
    })
};