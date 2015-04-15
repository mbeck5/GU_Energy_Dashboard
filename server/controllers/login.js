var bcrypt = require('bcrypt-nodejs');
var nodemailer = require('nodemailer');
var crypto = require('crypto');
/*var transporter = nodemailer.createTransport({
    auth: {
        user: 'debert@zagmail.gonzaga.edu',
        pass: ''
    }
});*/
var transporter = nodemailer.createTransport();

function send(link, to){
    //Using direct transport isn't reliable because it uses port 25, which is often blocked by default.
    //Prefer to use a SMTP provider, but that wasn't working for me.
    var mailOptions = {
        from: 'Gonzaga Energy Dashboard <debert@zagmail.gonzaga.edu>',
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
        crypto.randomBytes(48, function(ex, buf){
            var token = buf.toString('hex');
            var queryString = "INSERT INTO users (email, username, password, token) VALUES ('" + email + "', '" + username + "', '" + hash + "', '" + token + "')";
            connection.query(queryString, function (err, rows) {
                if (err) {
                    res.send(err);
                }
                else {
                    var link = req.protocol + '://' + req.get('host') + "/#/verify?email=" + email + "&token=" + token;
                    send(link, email);
                    res.send([]);
                }
            });
        });
    });
};

exports.confirmUser = function(req, res){
    var email = req.body.email;
    var token = req.body.token;
    var queryString = "UPDATE users SET confirmed = 1 WHERE token = '" + token + "' AND email = '" + email + "'";
    connection.query(queryString, function (err, rows) {
        if (err) {
            throw(err);
        }
        else {
            res.send([]);
        }
    });
};