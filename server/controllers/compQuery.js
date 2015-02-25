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
            return;
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

                    return;
                }
            });
            return;
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
