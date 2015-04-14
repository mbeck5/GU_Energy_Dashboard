var bcrypt = require('bcrypt-nodejs');


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
    var password = req.query.password;
    var queryString = "SELECT password FROM users WHERE username = '" + user + "'";
    connection.query(queryString, function (err, rows) {
        if (err) {
            throw err;
        }
        else {
            bcrypt.compare(password, rows[0].password, function(err, same){
                if(same){
                    res.send([true]);
                }
                else{
                    res.send([false]);
                }
            });
        }
    });
};

exports.addUser = function(req, res){
    var email = req.body.email;
    var username = email.substring(0, email.indexOf("@"));
    var password = req.body.password;
    bcrypt.hash(password, null, null, function(err, hash){
        var queryString = "INSERT INTO users (email, username, password) VALUES ('" + email + "', '" + username + "', '" + hash + "')";
        connection.query(queryString, function (err, rows) {
            if (err) {
                res.send(err);
            }
            else {
                res.send([]);
            }
        });
    });
};