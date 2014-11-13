exports.getBuildings = function(req, res){
    connection.connect();
    connection.query('SELECT name FROM building_data', function(err, rows){
        if(err){
            console.log(err);
            throw err;
        }
        else {
            console.log('success');
            res.send(rows);
        }
    });
    connection.end();
};
