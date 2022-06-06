var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
    res.redirect("/customer")
});

/**
 * for renew certbot in iabt.io run below command
 * #certbot certonly --webroot -w /home/iabrokerdashboard/public -d iabroker.iabt.io
 */
router.get('/.well-known/acme-challenge/:filename', function(req, res, next) {
    res.sendFile(require('path').resolve('public/.well-known/acme-challenge/'+req.params.filename))
});

/*router.get('/weather/cities/:name', function(req, res, next) {
    let request = require('request');
    let headers = {
        'authority': 'forecast7.com',
        'accept': 'application/json, text/plain, *!/!*',
        'origin': 'https://weatherwidget.io',
        'sec-fetch-site': 'cross-site',
        'sec-fetch-mode': 'cors',
        'referer': 'https://weatherwidget.io/'
    };

    let options = {
        url: 'https://forecast7.com/api/autocomplete/'+req.param('name'),
        headers: headers
    };

    function callback(error, response, body) {
        if (!error && response.statusCode === 200) {
            //console.log(body);
            res.json(body);
        }else {
            res.json({})
        }
    }
    request(options, callback);
});

router.get('/weather/citycode/:code', function(req, res, next) {
    let request = require('request');
    let headers = {
        'authority': 'forecast7.com',
        'accept': 'application/json, text/plain, *!/!*',
        'origin': 'https://weatherwidget.io',
        'sec-fetch-site': 'cross-site',
        'sec-fetch-mode': 'cors',
        'referer': 'https://weatherwidget.io/'
    };

    let options = {
        url: 'https://forecast7.com/api/getUrl/'+req.param('code'),
        headers: headers
    };

    function callback(error, response, body) {
        if (!error && response.statusCode === 200) {
            //console.log(body);
            res.json(body);
        }else {
            res.json({})
        }
    }
    request(options, callback);
});*/

module.exports = router;
