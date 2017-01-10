/**
 * Created by Ash on 2017/1/7.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/reservations', function(req, res, next) {
    //res.render('index', { title: 'Express' });
    res.send('Show reservations page');
});

module.exports = router;
