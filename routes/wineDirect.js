var express = require('express');
var router = express.Router();
var soap = require('soap');
var wsdl = 'https://webservices-test.winedirect.com/4/0/dtc.asmx?WSDL';
var uri = 'https://webservices-test.winedirect.com/4/0/dtc.asmx?';
var log = require('log4js').getLogger("wineDirect");
var products = router.get('/getProducts/:id', function(req, res, next) {

    var getProductsRequest = {
        GetProductsRequest: {
            AuthenticationInfo: {
                UserName: 'test_account_4',
                Password: 'WineDirect'
            },
            AccountNumber: '657076',
            SKU: req.params.id
        }
    };

    soap.createClient(wsdl, { endpoint: uri }, function(err, client) {
        client.GetProducts(getProductsRequest, function(err, result) {
            var productResult = JSON.stringify(result);
            log.debug("product data", productResult);
            res.render('productResult', { products: productResult });
        });
    });
});

module.exports = router;