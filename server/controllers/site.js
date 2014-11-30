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
    connection.query("SELECT meters_mly_data.trend_date as date, meters_mly_data.consumption, meters.meter_type_id as meterTypeId" +
    " FROM meters_mly_data INNER JOIN meters ON meters.meter_id = meters_mly_data.meter_id" +
    " WHERE meters.meter_name LIKE '%" + req.param("building") + "%' ORDER BY date", function(err, rows){
        if(err){
            throw err;
        }
        else {
            res.send(rows);
        }
    });
};
