var bcrypt = require('bcrypt-nodejs');
var nodemailer = require('nodemailer');
var crypto = require('crypto');

//Create the nodemailer transport for sending email.
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth:{
        user: 'guenergydashboard@gmail.com',
        pass: 'MarkDJDylanTyler'
    }
});

//Create and send the message to new users.
function send(link, to){
    //Using direct transport isn't reliable because it uses port 25, which is often blocked by default.
    //Prefer to use a SMTP provider, but that wasn't working for me.
    var mailOptions = {
        from: 'Gonzaga Energy Dashboard',
        to: to,
        subject: "Please confirm your email account.",
        html: "Hello,<br><br> Please <a href="+link+">click here</a> to verify your email.<br><br>Thank you,<br> GU Energy Dashboard Team"
    };
    transporter.sendMail(mailOptions, function(err, res){
        if(err){
            throw(err);
        }
        else{
            console.log('sent');
        }
    })
}

//Gets and returns the salt associated with a given user
exports.getUser = function(req, res){
    var user = req.query.email.split('@')[0];
    var queryString = "SELECT salt FROM users WHERE username = '" + user + "'";
    connection.query(queryString, function(err, rows){
        if(err){
            throw err;
        }
        else {
            res.send(rows);
        }
    });
};

//Gets the hashed password associated with a given user.
exports.getPassword = function(req, res) {
    var user = req.query.email.split('@')[0];
    var hash = req.query.hash;
    var queryString = "SELECT password FROM users WHERE username = '" + user + "'";
    connection.query(queryString, function (err, rows) {
        if (err) {
            throw err;
        }
        else {
            if(hash === rows[0].password){
                res.send([true]);
            }
            else{
                res.send([false]);
            }
        }
    });
};

//Adds a user's email, username, and generated salt to the database.
exports.addUserEmail = function(req, res){
    var email = req.body.email;
    //username is the same as their blackboard username (everything before the @ in their email).
    var username = email.substring(0, email.indexOf("@"));
    bcrypt.genSalt(10, function(err, salt){
        var queryString = "INSERT INTO users (email, username, salt) VALUES ('" + email + "', '" + username + "', '" + salt + "')";
        connection.query(queryString, function (err, rows) {
            if (err) {
                res.send(err);
            }
            else {
                res.send(salt);
            }
        });
    });
};

//Adds the user's hashed password to the database.
exports.addUserPassword = function(req, res){
    var email = req.body.email;
    var hash = req.body.hash;
    crypto.randomBytes(48, function(ex, buf){
        var token = buf.toString('hex');
        var queryString = "UPDATE users SET password = '" + hash + "', token = '" + token + "' WHERE email = '" + email + "'";
        connection.query(queryString, function (err, rows) {
            if (err) {
                res.send(err);
            }
            else {
                var link = req.protocol + '://' + hostURL + "/#/verify?email=" + email + "&token=" + token;
                send(link, email);
                res.send('OK');
            }
        });
    });
};

exports.confirmUser = function(req, res) {
    var email = req.body.email;
    var token = req.body.token;
    var queryString = "UPDATE users SET confirmed = 1 WHERE token = '" + token + "' AND email = '" + email + "'";
    connection.query(queryString, function (err, rows) {
        if (err) {
            throw(err);
        }
        else {
            res.send('OK');
        }
    });
};

exports.isConfirmed = function(req, res){
    var user = req.query.user.split('@')[0];
    var queryString = "SELECT confirmed FROM users WHERE username = '" + user + "'";
    connection.query(queryString, function (err, rows) {
        if (err) {
            throw(err);
        }
        else {
            res.send(rows);
        }
    });
};