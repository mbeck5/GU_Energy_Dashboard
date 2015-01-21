var stdDev = require('../services/standardDeviation');

exports.getBuildings = function(req, res){
    connection.query("SELECT DISTINCT BUILDING_NAME AS name, BUILDING_ID as id FROM building WHERE BUILDING_NAME != 'undefined' ORDER BY BUILDING_NAME", function(err, rows){
        if(err){
            throw err;
        }
        else {
            res.send(rows);
        }
    });
};

exports.getBuildingTypes = function(req, res){
    queryString = "SELECT DISTINCT building_type.BUILDING_TYPE " +
                    "FROM building JOIN building_type ON building.BUILDING_TYPE_ID = building_type.BUILDING_TYPE_ID " +
                    "WHERE building_type.BUILDING_TYPE_ID != 1;"

    connection.query(queryString, function(err, rows){
        if(err){
            throw err;
        }
        else{
            res.send(rows);
        }
    })
};

exports.getResources = function(req, res){
    queryString = "SELECT meters_dly_data.trend_date as date, meters_dly_data.consumption " +
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

exports.getResourcesByType = function(req, res){
    queryString = "SELECT sum(CONSUMPTION) as Total, b.BUILDING_TYPE_ID " +
                    "FROM erb_tree e, " +
                        "(SELECT * " +
                        "FROM (SELECT METER_ID, CONSUMPTION " +
                                "FROM meters_dly_data " +
                                "ORDER BY TREND_DATE DESC) as most_recent_entries " +
                        "JOIN erb_tree ON most_recent_entries.METER_ID = erb_tree.METER_ID " +
                        "WHERE METER_TYPE_ID= " + req.param("meterType") + " " +
                        "GROUP BY most_recent_entries.METER_ID) as t" +
                    "WHERE e.NODE_ID = t.PARENT_NODE_ID AND b.BUILDING_ID = e.BUILDING_ID " +
                    "GROUP BY b.BUILDING_TYPE_ID"

    connection.query(queryString, function(err, rows){
        if(err){
            throw err;
        }
        else {
            res.send(rows);
        }
    });
}

exports.getResourcesFromName = function(req, res) {
    queryString = "SELECT meters_dly_data.trend_date as date, meters_dly_data.consumption " +
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
