var moment = require('moment');
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
    var queryString = "SELECT building_name as name, " + tableName + ".trend_date as date, SUM(" + tableName + ".consumption) as consumption " +
                        "FROM building, building_meters, meters, " + tableName + " " +
                        "WHERE building_meters.meter_id = meters.meter_id AND meters_dly_data.meter_id = meters.meter_id AND trend_date >= '" + startDate +
                            "' AND trend_date <= '" + endDate + "' AND building_meters.building_id = " + req.query.building +
                            " AND meter_type_id = " + req.query.meterType + " AND building.building_id = building_meters.building_id GROUP BY date;";

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
    var queryString = "SELECT " + tableName + ".trend_date as date, SUM(" + tableName + ".consumption) as consumption " +
                        "FROM " + tableName + " " +
                        "JOIN meters ON " + tableName + ".METER_ID=meters.METER_ID " +
                        "WHERE meter_type_id = " + req.query.meterType + " AND " + tableName + ".trend_date >= '" + startDate + "' AND " + tableName + ".trend_date <= '" + endDate + "' AND meters.meter_id IN " +
                            "(SELECT METER_ID " +
                                "FROM erb_tree " +
                                "WHERE PARENT_NODE_ID IN (SELECT NODE_ID " +
                                                            "FROM erb_tree " +
                                                            "WHERE BUILDING_ID IN (SELECT building_id " +
                                                                                    "FROM building " +
                                                                                    "WHERE building_name = '" + req.query.building + "'))) GROUP BY date;";

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
    queryString = "SELECT bt.BUILDING_TYPE as type, SUM(CONSUMPTION) as total_cons " +
                    "FROM erb_tree e, building b, building_type bt, " +
                        "(SELECT * " +
                        "FROM (SELECT METER_ID as MID, CONSUMPTION " +
                                "FROM meters_dly_data " +
                                "ORDER BY TREND_DATE DESC) as most_recent_entries " +
                        "JOIN erb_tree ON most_recent_entries.MID = erb_tree.METER_ID " +
                        "WHERE METER_TYPE_ID= " + req.query.meterType + " " +
                        "GROUP BY most_recent_entries.MID) as t " +
                    "WHERE e.NODE_ID = t.PARENT_NODE_ID AND b.BUILDING_ID = e.BUILDING_ID AND bt.BUILDING_TYPE_ID = b.BUILDING_TYPE_ID AND b.BUILDING_TYPE_ID != 1 " +
                    "GROUP BY b.BUILDING_TYPE_ID";

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
    queryString = "SELECT sum(total_cons) as res_sum " +
                    "FROM " +
                        "(SELECT bt.BUILDING_TYPE as type, SUM(CONSUMPTION) as total_cons " +
                        "FROM erb_tree e, building b, building_type bt, " +
                            "(SELECT * " +
                            "FROM (SELECT METER_ID as MID, CONSUMPTION " +
                                    "FROM meters_dly_data " +
                                    "ORDER BY TREND_DATE DESC) as most_recent_entries " +
                            "JOIN erb_tree ON most_recent_entries.MID = erb_tree.METER_ID " +
                            "WHERE METER_TYPE_ID= " + req.query.meterType + " " +
                            "GROUP BY most_recent_entries.MID) as t " +
                        "WHERE e.NODE_ID = t.PARENT_NODE_ID AND b.BUILDING_ID = e.BUILDING_ID AND bt.BUILDING_TYPE_ID = b.BUILDING_TYPE_ID AND b.BUILDING_TYPE_ID != 1 " +
                        "GROUP BY b.BUILDING_TYPE_ID) as totals_table";

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




