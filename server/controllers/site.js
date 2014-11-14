exports.getBuildings = function(req, res){
    connection.query('SELECT name FROM building_data ORDER BY name', function(err, rows){
        if(err){
            throw err;
        }
        else {
            res.send(rows);
        }
    });
};
