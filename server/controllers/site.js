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

exports.getResources = function(req, res){
    queryString = "SELECT meters_dly_data.trend_date as date, meters_dly_data.consumption, meters.meter_type_id as meterTypeId " +
                    "FROM meters_dly_data " +
                    "JOIN meters ON meters_dly_data.METER_ID=meters.METER_ID " +
                    "WHERE meters.meter_id IN (SELECT METER_ID " +
                                                "FROM erb_tree " +
                                                "WHERE PARENT_NODE_ID IN (SELECT NODE_ID " +
                                                                            "FROM erb_tree " +
                                                                            "WHERE BUILDING_ID = " + req.param("building") + ")) ORDER BY date;"

    connection.query(queryString, function(err, rows){
        if(err){
            throw err;
        }
        else {
            res.send(rows);
        }
    });
};
