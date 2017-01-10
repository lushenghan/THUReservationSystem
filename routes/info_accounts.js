/**
 * Created by Ash on 2017/1/7.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/info_accounts', function(req, res, next) {
    //res.render('index', { title: 'Express' });
    res.send('Show info_accounts page');
});

module.exports = router;
