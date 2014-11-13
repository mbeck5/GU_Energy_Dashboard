exports.getBuildings = function(req, res){
    console.log('get');
    connection.query('SELECT building FROM building_data', function(err, rows){
        if(err){
            throw err;
        }
        else {
            //res.send(rows);
            console.log('hello');
        }
    });
};
