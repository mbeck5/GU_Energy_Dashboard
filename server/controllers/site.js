exports.getBuildings = function(req, res){
    connection.query('SELECT DISTINCT name FROM building_data ORDER BY name', function(err, rows){
        if(err){
            throw err;
        }
        else {
            res.send(rows);
        }
    });
};

exports.getResources = function(req, res){
    connection.query("SELECT water, electricity, gas FROM building_data WHERE name = '" + req.param("building") + "' ORDER BY date", function(err, rows){
        if(err){
            throw err;
        }
        else {
            res.send(rows);
        }
    });
};

exports.getWater = function(req, res){
    connection.query("SELECT water FROM building_data WHERE name = '" + req.param("building") + "' ORDER BY date", function(err, rows){
        if(err){
            throw err;
        }
        else {
            res.send(rows);
        }
    });
};

exports.getElectricity = function(req, res){
    connection.query("SELECT electricity FROM building_data WHERE name = '" + req.param("building") + "' ORDER BY date", function(err, rows){
        if(err){
            throw err;
        }
        else {
            res.send(rows);
        }
    });
};

exports.getGas = function(req, res){
    connection.query("SELECT gas FROM building_data WHERE name = '" + req.param("building") + "' ORDER BY date", function(err, rows){
        if(err){
            throw err;
        }
        else {
            res.send(rows);
        }
    });
};

