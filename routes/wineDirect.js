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
            AccountNumber: '657076'
        }
    };

    soap.createClient(wsdl, { endpoint: uri }, function(err, client) {
        client.GetProducts(getProductsRequest, function(err, result) {
            var productResult = JSON.stringify(result);
            log.debug("product data", productResult);
            res.send(productResult);
        });
    });
});

var order = router.post('/createOrder', function(req, res, next) {
    log.debug('order data from shopify', req.body);
    var createOrderRequest = {
        SubmitOrdersRequest: {
            AuthenticationInfo: {
                UserName: 'test_account_4',
                Password: 'WineDirect'
            },
            AccountNumber: '657076',
            Orders: [{
                DtcOrder: {
                    OrderId: req.body.id,
                    SoldTo: {
                        ConsumerId: req.body.customer.id,
                        FirstName: req.body.customer.first_name,
                        LastName: req.body.customer.last_name,
                        EmailAddress: req.body.customer.email,
                        TelephoneNumber: req.body.customer.default_address.phone,
                        Address: {
                            CompanyName: req.body.customer.default_address.company,
                            Line1: req.body.customer.default_address.address1,
                            Line2: req.body.customer.default_address.address2,
                            City: req.body.customer.default_address.city,
                            StateOrProvince: req.body.customer.default_address.province,
                            PostalCode: req.body.customer.default_address.zip,
                            CountryCode: req.body.customer.default_address.country_code
                        }
                    },
                    ShipTo: {
                        FirstName: req.body.shipping_address.first_name,
                        LastName: req.body.shipping_address.last_name,
                        TelephoneNumber: req.body.shipping_address.phone,
                        Address: {
                            CompanyName: req.body.shipping_address.company,
                            Line1: req.body.shipping_address.address1,
                            Line2: req.body.shipping_address.address2,
                            City: req.body.shipping_address.city,
                            StateOrProvince: req.body.shipping_address.province,
                            PostalCode: req.body.shipping_address.zip,
                            CountryCode: req.body.shipping_address.country_code
                        }
                    },
                    TotalSale: req.body.total_price,
                    OrderLines: [{
                        DtcOrderLine: {
                            LineNumber: req.body.line_items[0].id,
                            Quantity: req.body.line_items[0].quantity,
                            SKU: req.body.line_items[0].sku,
                            UnitPrice: req.body.line_items[0].price
                        }
                    }],
                },

            }]
        }
    }
    console.log('create order request ', createOrderRequest);
    res.status(200).send(req.body);
});


module.exports = router;