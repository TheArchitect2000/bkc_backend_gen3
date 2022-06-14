// Previous Name: app.js
const compression = require('compression');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
//add security
const helmet = require('helmet');
const cookieEncrypter = require('cookie-encrypter');
const isBot = require('isbot');

//run iabroker embeded
const iabroker = require('./IAbroker');

const app = express();

app.use(require('express-status-monitor')());

app.use(compression())

app.use(helmet());



// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json({ limit: '50mb' }))

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));


let secretforencandsign = 'rufhi&6%yr3987Yuyw63iwyhHoUYfR%)';
app.use(cookieParser(secretforencandsign));
app.use(cookieEncrypter(secretforencandsign));//secret had to be 32 characters
//access check, prevent bots, todo check performance
app.use(function(req, res, next) {
    console.error(req.originalUrl)
    if(! isBot(req.get('user-agent')) ){
        next();
    } else {
        if(req.originalUrl.startsWith('/resources/firmwares') || req.originalUrl.startsWith('/resources/fileserver') || req.originalUrl.startsWith('/customer/playlist/last')){
            console.debug("firmware download");
            next();
        } else {
            console.error("Bot user");
            res.status(401).send({error: "Bot detected"});
        }
    }
});

app.use('/customer', require('./back-end/routes/customer.routes'));
// app.use('/vendor', require('./routes/customer.routes'));
app.use('/admin*', require('./back-end/routes/customer.routes'));
app.use('/', require('./back-end/routes/index'));

//must be after /customer and like it
//app.use(express.static(path.join(__dirname, 'public') /*, { etag: true, cacheControl: true, maxAge: '1d' }*/ ));
//app.use(express.static(path.join(__dirname, 'library') /*, { etag: true, cacheControl: true, maxAge: '1d' }*/ ));
app.use(express.static('library/front-end'));

let setCache = function (req, res, next) {
    // here you can define period in second, this one is 24 hours
    const period = 3600 * 24

    // you only want to cache for GET requests
    if (req.method == 'GET') {
        res.set('Cache-control', `private, max-age=${period}`)
    } else {
        // for the other requests set strict no caching parameters
        res.set('Cache-control', `private, max-age=${period}`)
    }

    // remember to call next() to pass on the request
    next()
}

// now call the new middleware function in your app


//jsnlog for client log to server
var JL = require('jsnlog').JL;
var jsnlog_nodejs = require('jsnlog-nodejs').jsnlog_nodejs;

//if it is after statics then does'nt log loading static files
app.use(logger('dev'));


//for give back logs from browser
app.post('*.logger', function (req, res, next) {
    jsnlog_nodejs(JL, req.body);

    // Send empty response. This is ok, because client side jsnlog does not use response from server.
    res.send('');
});


//access check
app.use(function(req, res, next) {
    let signedin = req.signedCookies['signedin'];
    let customer = req.signedCookies['customer'];
    if(signedin && customer ){
        console.log("ok cookie");
        // console.log(req.signedCookies['customer']._id);
        next();
    }else {
        console.error("not cookie");
        res.status(401).send({ error : "Need Login" });
    }
});


// app.use('/crud', require('./routes/crud'));
app.use('/iahome', require('./back-end/routes/iahome.routes'));
app.use('/iavendor', require('./back-end/routes/iavendor.routes'));
app.use('/iadevice', require('./back-end/routes/iadevice.routes'));
app.use('/iacustomer', require('./back-end/routes/iacustomer.routes'));
app.use('/iaservice', require('./back-end/routes/iaservice.routes'));
app.use('/iaactivity', require('./back-end/routes/iaactivity.routes'));
app.use('/installedservice', require('./back-end/routes/installedservice.routes'));
app.use('/iafs', require('./back-end/routes/iafileserver.routes'));
app.use('/iavoice', require('./back-end/routes/iavoice.routes'));
app.use('/iaticket', require('./back-end/routes/iaticket.routes'));
app.use('/iadevicetype', require('./back-end/routes/iadevicetype.routes'));



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  console.error('error handler', err.message);
  // render the error page
  res.status(err.status || 500);
  //res.render('error');
  res.json({error:err});

});




// Configuring the database
const dbConfig = require('../configs/mongo.config');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

if(require('../configs/which.config').debugmongoose)
    mongoose.set('debug', true);

// Connecting to the database
mongoose.connect(dbConfig.serverurl+'/iasystem', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.error('Could not connect to the database. Exiting now...', err);
    // process.exit();
});

//for cache
// app.use(setCache)

module.exports = app;
