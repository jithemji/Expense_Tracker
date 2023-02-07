const mysql = require("mysql2");
const express = require("express");
const bodyParser = require("body-parser");
const { use } = require("express/lib/application");
const encoder = bodyParser.urlencoded({ extended: false });
const bcrypt = require("bcrypt");
// var nodemailer = require('nodemailer');
const res = require("express/lib/response");
const app = express();


app.use("/assets", express.static("assets"));
app.set('view engine', 'ejs');
// var transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: 'sauravkumar52270@gmail.com',
//         pass: 'qeksqvyedpdvepqh'
//     }
// });
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "@Jagriti19", //Password of mysql connection
    database: "expense-tracker", //Database name 
    // multipleStatements: true
});

// connect to the database
connection.connect(function(error) {
    if (error) throw error
    else console.log("connected to the database successfully!")
});


app.get("/login", function(req, res) {
    res.render('login');
})
app.get("/", function(req, res) {
    res.render('register');
})

app.get("/about", function(req, res) {
    res.render('about', { username });
})

app.get("/loginUnsuccess", function(req, res) {

    res.render('loginUnsuccess');
})

app.get("/register", function(req, res) {
    res.render('register');
})
app.get("/registeredAlready", function(req, res) {
    res.render('registeredAlready');
})
app.get("/loginAfterReg", function(req, res) {
    res.render('loginAfterReg');
})
app.get("/logout", function(req, res) {
    res.render('logout');

})

app.get("/accountdelete", function(req, res) {
    res.render('accountdelete', { username });
})

var userId;
var username;
var useremailformail;
app.post("/login", encoder, async function(req, res) {
    var useremail = req.body.useremail;
    var password = req.body.password;
    connection.query("select * from users where userEmail = ?", [useremail], function(error, results, fields) {
        if (results.length > 0) {
            useremailformail = useremail;
            username = results[0].firstName.toUpperCase();
            userId = results[0].customerId;
            var pass = results[0].password;
            if (bcrypt.compareSync(password, pass))
                res.redirect("/home");
        } else {
            res.redirect("/loginUnsuccess");
        }
        res.end();
    })
})


app.get("/home", function(req, res) {
    connection.query("select * from items", function(error, results, fields) {
        res.render('home', { results, userId, username });
    })
})


    

app.post("/register", encoder, async function(req, res) {
    var firstname = req.body.firstname;
    //var password = req.body.password;
    var lastname = req.body.lastname;
    var useremail = req.body.useremail;
    const hashPassword = bcrypt.hashSync(req.body.password, 10);
    console.log(hashPassword);
    // var mailOptions = {
    //     from: 'sauravkumar52270@gmail.com',
    //     to: useremail,
    //     subject: 'Shopsee registration',
    //     text: 'Welcome to shopsee, explore the world at your home'
    // };

    // transporter.sendMail(mailOptions, function(error, info) {
    //     if (error) {
    //         console.log(error);
    //     } else {
    //         console.log('Email sent: ' + info.response);
    //     }
    // });
    connection.query("insert into registeredUser(firstName, lastName, userEmail, password, registrationTime) values (?,?,?,?,now());", [firstname, lastname, useremail, hashPassword], function(error, results, fields) {

        if (error) {
            console.log(error);

            res.redirect("/registeredAlready");

        } else {
            res.redirect("/loginAfterReg");
        }
        res.end();
    })
})


app.listen(process.env.PORT || 3000);