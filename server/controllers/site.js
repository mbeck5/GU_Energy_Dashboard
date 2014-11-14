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
