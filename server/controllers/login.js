exports.getUser = function(req, res){
    var user = req.query.email;
    var queryString = "SELECT * FROM users WHERE username = '" + user + "'";
    connection.query(queryString, function(err, rows){
        if(err){
            throw err;
        }
        else {
            res.send(rows);
        }
    });
};

exports.getPassword = function(req, res) {
    var user = req.query.email;
    var queryString = "SELECT password FROM users WHERE username = '" + user + "'";
    connection.query(queryString, function (err, rows) {
        if (err) {
            throw err;
        }
        else {
            res.send(rows);
        }
    });
};

exports.addUser = function(req, res){
    var email = req.body.email;
    var username = email.substring(0, email.indexOf("@"));
    var password = req.body.password;
    var queryString = "INSERT INTO users (email, username, password) VALUES ('" + email + "', '" + username + "', '" + password + "')";
    connection.query(queryString, function (err, rows) {
        if (err) {
            throw err;
        }
        else {
            res.send([]);
        }
    });
};