var moment = require('moment');

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

exports.getBuildingTypes = function(req, res){
    queryString = "SELECT BUILDING_TYPE " +
                    "FROM building_type " +
                    "WHERE BUILDING_TYPE_ID != 1;";

    connection.query(queryString, function(err, rows){
        if(err){
            throw err;
        }
        else {
            res.send(rows);
        }
    });
};

exports.getResources = function(req, res){
    var isDetailed = req.query.isDetailed;
    var startDate = req.query.startDate;
    var endDate = req.query.endDate;
    var tableName;
    if(isDetailed === 'true'){
        tableName = "meters_dly_data";
    }
    else{
        tableName = "meters_mly_data";
    }
    //if no dates entered, provide defaults
    if(!startDate || !endDate){
        endDate = moment().format("YYYY-MM-DD HH:mm:ss");
        startDate = moment().subtract(1, 'years');
    }
    else {
        startDate = moment(startDate).format("YYYY-MM-DD HH:mm:ss");
        endDate = moment(endDate).format("YYYY-MM-DD HH:mm:ss");
    }
    var queryString = "SELECT building_name as name, " + tableName + ".trend_date as date, SUM(DISTINCT " + tableName + ".consumption) as consumption " +
                        "FROM building, building_meters, meters, " + tableName + " " +
                        "WHERE building_meters.meter_id = meters.meter_id AND " + tableName + ".meter_id = meters.meter_id AND trend_date >= '" + startDate + "' AND trend_date <= '" + endDate + "' AND building_meters.building_id = " + req.query.building + " AND meter_type_id = " + req.query.meterType + " AND building.building_id = building_meters.building_id " +
                        "GROUP BY date " +
                        "HAVING consumption > " +
                            "(SELECT AVG(consumption) - (3 * STDDEV(consumption)) " +
                            "FROM (" +
                                "SELECT SUM(DISTINCT " + tableName + ".consumption) as consumption " +
                                "FROM building, building_meters, meters, " + tableName + " " +
                                "WHERE building_meters.meter_id = meters.meter_id AND " + tableName + ".meter_id = meters.meter_id AND trend_date >= '" + startDate + "' AND trend_date <= '" + endDate + "' AND building_meters.building_id = " + req.query.building + " AND meter_type_id = " + req.query.meterType + " AND building.building_id = building_meters.building_id " +
                                "GROUP BY trend_date) as t) AND " +
                        "consumption < " +
                            "(SELECT AVG(consumption) + (3 * STDDEV(consumption)) " +
                            "FROM (" +
                                "SELECT SUM(DISTINCT " + tableName + ".consumption) as consumption " +
                                "FROM building, building_meters, meters, " + tableName + " " +
                                "WHERE building_meters.meter_id = meters.meter_id AND " + tableName + ".meter_id = meters.meter_id AND trend_date >= '" + startDate + "' AND trend_date <= '" + endDate + "' AND building_meters.building_id = " + req.query.building + " AND meter_type_id = " + req.query.meterType + " AND building.building_id = building_meters.building_id " +
                                "GROUP BY trend_date) as t);";

    connection.query(queryString, function(err, rows){
        if(err){
            throw err;
        }
        else {
            res.send(rows);
        }
    });
};

exports.getResourcesFromName = function(req, res) {
    var isDetailed = req.query.isDetailed;
    var startDate = req.query.startDate;
    var endDate = req.query.endDate;
    var tableName;
    if(isDetailed === 'true'){
        tableName = "meters_dly_data";
    }
    else{
        tableName = "meters_mly_data";
    }
    //if no dates entered, provide defaults
    if(!startDate || !endDate){
        endDate = moment().format("YYYY-MM-DD HH:mm:ss");
        startDate = moment().subtract(1, 'years');
    }
    else{
        startDate = moment(startDate).format("YYYY-MM-DD HH:mm:ss");
        endDate = moment(endDate).format("YYYY-MM-DD HH:mm:ss");
    }
    var queryString = "SELECT building_name as name, " + tableName + ".trend_date as date, SUM(DISTINCT " + tableName + ".consumption) as consumption " +
                        "FROM building, building_meters, meters, " + tableName + " " +
                        "WHERE building_meters.meter_id = meters.meter_id AND " + tableName + ".meter_id = meters.meter_id AND trend_date >= '" + startDate + "' AND trend_date <= '" + endDate + "' AND building.building_name = '" + req.query.building + "' AND meter_type_id = " + req.query.meterType + " AND building.building_id = building_meters.building_id " +
                        "GROUP BY date " +
                        "HAVING consumption > " +
                            "(SELECT AVG(consumption) - (3 * STDDEV(consumption)) " +
                            "FROM (" +
                                "SELECT SUM(DISTINCT " + tableName + ".consumption) as consumption " +
                                "FROM building, building_meters, meters, " + tableName + " " +
                                "WHERE building_meters.meter_id = meters.meter_id AND " + tableName + ".meter_id = meters.meter_id AND trend_date >= '" + startDate + "' AND trend_date <= '" + endDate + "' AND building.building_name = '" + req.query.building + "' AND meter_type_id = " + req.query.meterType + " AND building.building_id = building_meters.building_id " +
                                "GROUP BY trend_date) as t) AND " +
                        "consumption < " +
                            "(SELECT AVG(consumption) + (3 * STDDEV(consumption)) " +
                            "FROM (" +
                                "SELECT SUM(DISTINCT " + tableName + ".consumption) as consumption " +
                                "FROM building, building_meters, meters, " + tableName + " " +
                                "WHERE building_meters.meter_id = meters.meter_id AND " + tableName + ".meter_id = meters.meter_id AND trend_date >= '" + startDate + "' AND trend_date <= '" + endDate + "' AND building.building_name = '" + req.query.building + "' AND meter_type_id = " + req.query.meterType + " AND building.building_id = building_meters.building_id " +
                                "GROUP BY trend_date) as t);";

    connection.query(queryString, function(err, rows){
        if(err){
            throw err;
        }
        else {
            res.send(rows)
        }
    });
};

exports.getResourcesByType = function(req, res){

    var date = req.query.date;

    //if no dates entered, provide defaults
    if(!date){
        date = moment().subtract(1, 'days');
    }
    else{
        date = moment(date).format("YYYY-MM-DD HH:mm:ss");
    }

    queryString = "SELECT building_type.building_type as type, SUM(consumption) as total_cons FROM " +
                    "(SELECT SUM(DISTINCT meters_dly_data.consumption) as consumption, building.building_type_id " +
                        "FROM building, building_meters, meters, meters_dly_data " +
                        "WHERE building_meters.meter_id = meters.meter_id AND meters_dly_data.meter_id = meters.meter_id AND trend_date = '" + date +
                        "' AND building_meters.building_id IN (SELECT building.building_id FROM building WHERE building_id != 1) " +
                        " AND meter_type_id = " + req.query.meterType + " AND building.building_id = building_meters.building_id " +
                            "GROUP BY building.building_id) as t, building_type " +
                    "WHERE t.building_type_id = building_type.building_type_id AND building_type.building_type_id != 1 GROUP BY t.building_type_id;";

    connection.query(queryString, function(err, rows){
        if(err){
            throw err;
        }
        else {
            res.send(rows);
        }
    });
};

exports.getResourceSum = function(req, res){
    var date = req.query.date;

    //if no dates entered, provide defaults
    if(!date){
        date = moment().subtract(1, 'days');
    }
    else{
        date = moment(date).format("YYYY-MM-DD HH:mm:ss");
    }

    queryString = "SELECT SUM(total_cons) as res_sum " +
                    "FROM " +
                        "(SELECT building_type.building_type as type, SUM(consumption) as total_cons FROM " +
                            "(SELECT SUM(DISTINCT meters_dly_data.consumption) as consumption, building.building_type_id " +
                                "FROM building, building_meters, meters, meters_dly_data " +
                                "WHERE building_meters.meter_id = meters.meter_id AND meters_dly_data.meter_id = meters.meter_id AND trend_date = '" + date +
                                "' AND building_meters.building_id IN (SELECT building.building_id FROM building WHERE building_id != 1) " +
                                " AND meter_type_id = " + req.query.meterType + " AND building.building_id = building_meters.building_id GROUP BY building.building_id) as t, building_type " +
                            "WHERE t.building_type_id = building_type.building_type_id AND building_type.building_type_id != 1 GROUP BY t.building_type_id) as totals_table";

    connection.query(queryString, function(err, rows){
        if(err){
            throw err;
        }
        else {
            res.send(rows);
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
    });
};




