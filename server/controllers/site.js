exports.getBuildings = function(req, res){
    connection.query("SELECT DISTINCT BUILDING_NAME AS name FROM building WHERE BUILDING_NAME != 'undefined' ORDER BY BUILDING_NAME", function(err, rows){
        if(err){
            throw err;
        }
        else {
            res.send(rows);
        }
    });
};

exports.getResources = function(req, res){
    connection.query("SELECT water, electric, gas, date FROM building_data WHERE name = '" + req.param("building") + "' ORDER BY date", function(err, rows){
        if(err){
            throw err;
        }
        else {
            res.send(rows);
        }
    });
};

exports.getWater = function(req, res){
    connection.query("SELECT water, date FROM building_data WHERE name = '" + req.param("building") + "' ORDER BY date", function(err, rows){
        if(err){
            throw err;
        }
        else {
            res.send(rows);
        }
    });
};

exports.getElectricity = function(req, res){
    connection.query("SELECT electric, date FROM building_data WHERE name = '" + req.param("building") + "' ORDER BY date", function(err, rows){
        if(err){
            throw err;
        }
        else {
            res.send(rows);
        }
    });
};

exports.getGas = function(req, res){
    connection.query("SELECT gas, date FROM building_data WHERE name = '" + req.param("building") + "' ORDER BY date", function(err, rows){
        if(err){
            throw err;
        }
        else {
            res.send(rows);
        }
    });
};

