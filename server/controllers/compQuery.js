exports.getCompetitions = function (req, res) {
    var queryString = "SELECT DISTINCT comp_name, cid, start_date, end_date, resource " +
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
    var addCompQueryString = "INSERT INTO competitions (cid, start_date, end_date, comp_name, resource)" +
            "VALUES (" + req.param("cid") + ",'" + req.param("startDate") + "','" + req.param("endDate") + "','" + req.param("compName") + "',"+ req.param("resourceId") +");"
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
    var editCompQueryString = "UPDATE competitions SET start_date='" + req.param("startDate")+ "', end_date='"+req.param("endDate")+"',"+
       " comp_name='"+req.param("compName")+"', resource="+req.param("resourceId") +" WHERE cid="+req.param("cid")+";";
    connection.query(editCompQueryString, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            return;
        }
    });
};

exports.deleteComp = function (req, res) {
    var deleteCompQueryString = "DELETE FROM energy_report.competitions WHERE cid=" + req.param("cid") + ";";
    connection.query(deleteCompQueryString, function (err, rows) {
        if (err) {
            throw err;
        }
        else {
            return;
        }
    });
};

