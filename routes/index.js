var express = require('express');
var router = express.Router();
var log = require('log4js').getLogger("index");

/* GET home page. */
router.get('/', function(req, res, next) {
    log.debug("Entering into index /");
    res.render('index', { title: 'Express' });
    log.debug("Exit from index /");
});

module.exports = router;