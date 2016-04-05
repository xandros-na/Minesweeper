var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var connection = mysql.createConnection({
    host: 'hopper.wlu.ca',
    user: 'migu0850',
    password: 'db01234',
    database: 'migu0850'
});

connection.useDefault = function() {
    connection.query("use migu0850;");
}

connection.login = function(email, pw, cb) {
    var sql = "select password from user where email=" + connection.escape(email);
    connection.query(sql, function(err, res, fields) {
        if (err) return cb(err);
        if (res.length > 0) {
            bcrypt.compare(pw, res[0].password, function(err, res) {
                return cb(res);
            });
        } else {
            return cb(null);
        }
        
    });
};

connection.signUp = function(email, pw, cb) {
    bcrypt.hash(pw, null, null, function(err, hash) {
        var sql = "insert into user (email, password) values (" + connection.escape(email) + ", " + connection.escape(hash) + ")";
        connection.query(sql, function(err, res, fields) {
            return err ? cb(err) : cb(res);
        });
    });
};

module.exports = connection;
