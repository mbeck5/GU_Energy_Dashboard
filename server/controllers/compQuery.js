var moment = require('moment');
var stdDev = require('../services/standardDeviation');

exports.getCompetitions = function (req, res) {
    var queryString = "SELECT DISTINCT comp_name, cid, start_date, end_date " +
        "FROM competitions " +
        "WHERE comp_name != 'undefined' " +
        "ORDER BY comp_name;";

    connection.query(queryString, function (err, rows) {
        if (err) {
            throw err;
        }
        else {
            res.send(rows);
        }
    });
};

exports.saveNewComp = function (req, res) {
    var addCompQueryString = "INSERT INTO competitions (cid, start_date, end_date, comp_name, resource) " +
            "VALUES (" + req.param("cid") + ",DATE('" + req.param("startDate") + "'),DATE('" + req.param("endDate") + "'),'" + req.param("compName") + "', 2);"
    connection.query(addCompQueryString, function (err, rows) {
        if (err) {
            throw err;
        }
        else {
            res.send(true);
        }
    });
};

exports.editNewComp = function (req, res) {
    var editCompQueryString = "UPDATE competitions SET start_date=DATE('" + req.param("startDate")+ "'), end_date=DATE('"+req.param("endDate")+"'),"+
       " comp_name='"+req.param("compName")+"' WHERE cid="+req.param("cid")+";";
    connection.query(editCompQueryString, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.send([]);
        }
    });
};

exports.deleteComp = function (req, res) {
    var deleteCompBuildingsQueryString = "DELETE FROM energy_report.competition_buildings WHERE cid=" + req.param("cid") + ";";
    connection.query(deleteCompBuildingsQueryString, function (err, rows) {
        if (err) {
            throw err;
        }
        else {
            var deleteCompQueryString = "DELETE FROM energy_report.competitions WHERE cid=" + req.param("cid") + ";";
            connection.query(deleteCompQueryString, function (err, rows) {
                if (err) {
                    throw err;
                }
                else {

                    res.send(true);
                }
            });
        }
    });
};

exports.addCompBuilding = function (req, res) {
    var addCompBuildingQueryString = "INSERT INTO competition_buildings (cid, bid) VALUES ("+ req.param("cid") + "," + req.param("bid") + ");";
    connection.query(addCompBuildingQueryString, function (err, rows) {
        if (err) {
            throw err;
        }
        else {
            res.send([]);
        }
    });
};

exports.deleteCompBuildings = function (req, res) {
    var addCompBuildingQueryString = "DELETE FROM energy_report.competition_buildings WHERE cid="+ req.param("cid") + ";";
    connection.query(addCompBuildingQueryString, function (err, rows) {
        if (err) {
            throw err;
        }
        else {
            res.send([]);
        }
    });
};

exports.getCompBuildingList = function (req, res) {
    var queryString = "SELECT DISTINCT bid FROM competition_buildings WHERE cid =" + req.param("cid") + ";";
    connection.query(queryString, function (err, rows) {
        if (err) {
            throw err;
        }
        else {
            res.send(rows);
        }
    });
};

exports.getBuildingTotals = function(req, res){
    var startDate = req.param("startDate");
    var endDate = req.param("endDate");
    var tableName = "meters_dly_data";

    //if no dates entered, provide defaults
    if(!startDate || !endDate){
        endDate = moment().format("YYYY-MM-DD HH:mm:ss");
        startDate = moment().subtract(1, 'years');
    }
    else {
        startDate = moment(startDate).format("YYYY-MM-DD HH:mm:ss");
        endDate = moment(endDate).format("YYYY-MM-DD HH:mm:ss");
    }

    var queryString = "SELECT building_name, sum(consumption) as consumption " +
                        "FROM competitions, building, competition_buildings, building_meters, meters, meters_dly_data " +
                        "WHERE building_meters.meter_id = meters.meter_id AND meters_dly_data.meter_id = meters.meter_id AND trend_date >= '" + startDate + "' " +
                            "AND trend_date <= '" + endDate + "' AND bid = building_meters.building_id AND meter_type_id = competitions.resource " +
                            "AND building.building_id = building_meters.building_id  AND competitions.cid = " + req.param("competitionId") + " " +
                            "AND competition_buildings.cid = competitions.cid GROUP BY bid";

    connection.query(queryString, function(err, rows){
        if(err){
            throw err;
        }
        else {
            res.send(stdDev.standardDeviationFilter(rows));
        }
    });
};