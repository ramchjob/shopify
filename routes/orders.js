var express = require('express');
var router = express.Router();
var log = require('log4js').getLogger("orders");

const SECRET = "0d4199ca77c936e8ee8ff4174defc3bb19cd88f2b51d4ec5c04cfbe3f84724a5";

var http = require('http'),
    crypto = require('crypto'),
    server;

/* POST orders creation . */
router.post('/creation', function(req, res, next) {
    log.debug("Entering into orders creation");

    var fs = require('fs');
    var data;
    fs.readFile('data.json', 'utf8', function(err, data) {
        if (err) {
            return log.error(err);
        }
        try {
            log.debug("Start parsing json data");
            data = JSON.parse(data);
            console.log(data.email);
            console.log(data.shipping_address.first_name);
            if (data.line_items.length > 0) {
                console.log(data.line_items[0].id);
            }
            log.debug("End parsing json data");
        } catch (e) {
            log.error("catch block from order creation file read");
            return log.error(e);
        }
    });



    res.status(200).send("Json response from orders..");
    log.debug("Exit from orders creation");
});


router.post('/getData', function(req, res) {
    req.body = '';

    req.on('data', function(chunk) {
        req.body += chunk.toString('utf8');
    });
    req.on('end', function() {
        handleRequest(req, res);
    });
});

function handleRequest(req, res) {
    console.log("req==" + req.body);
    if (verifyShopifyHook(req)) {
        console.log('Verified webhook');
        res.writeHead(200);
        res.end('Verified webhook');
    } else {
        res.writeHead(401);
        console.log('Unverified webhook');
        res.end('Unverified webhook');
    }
}

function verifyShopifyHook(req) {
    var digest = crypto.createHmac('SHA256', SECRET)
        .update(new Buffer(req.body, 'utf8'))
        .digest('base64');
    //console.log("digest== " + digest);
    // console.log(JSON.stringify(req.headers));
    return digest === req.headers['x-shopify-hmac-sha256'];
}

module.exports = router;