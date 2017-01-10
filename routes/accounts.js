/**
 * Created by Ash on 2017/1/7.
 */
var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function (req, res) {
    //res.render('index', { title: 'Express' });
    res.send('Show accounts page');
    //next();
});

router.get('/logout', function (req, res) {
    if (req.session.sign) {
        req.session.superManager = false;
        //res.sendFile(path.resolve(__dirname, '..') + "/views/" + "logout.ejs");
        res.render('logout.ejs');
    } else {
        //res.send("Access denied!");
        //res.sendFile(path.resolve(__dirname, '..') + "/views/" + "access_denied.ejs");
        res.render('access_denied.ejs');
        //console.log(path.resolve(__dirname, '..') + "/views/" + "logout.ejs");
    }
});

router.get('/login_super', function (req, res) {
    //res.sendFile(__dirname + "/views/" + "THU_RSystemSuperManagerLogin.html");
    res.render('login_super.ejs');
});

router.get('/login_user', function (req, res) {
    //res.sendFile(__dirname + "/views/" + "THU_RSystemUserLogin.html");
    res.render('login_user.ejs');
});

router.get('/register', function (req, res) {
    //res.sendFile(__dirname + "/public/" + "AddUserInfo.html");
    res.render('register.ejs');
});

module.exports = router;