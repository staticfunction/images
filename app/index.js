var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var bson = require('bson');
var mongodb = require('mongodb');
var assert = require('assert');
var pjson = require('pjson');
var app = express();

var Route = require('./routes/index');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/docs', express.static(path.join(__dirname, '../public')));
app.use('/version', (req, res) => {
    res.json({
            version: pjson.version,
            name: pjson.name
        });
})

app.use(expressValidator({
  customSanitizers: {
    toPasswordHash: function(value) {
      return passwordHash.generate(value);
    },
    toLowerCase: function(value) {
      return value.toLowerCase();
    },
    toUpperCase: function(value) {
        return value.toUpperCase();
    },
    toObjectId: (value) => {
      return bson.ObjectId(value);
    },
    toArrayOfObjectIds: (values) => {
      return values.map((value) => {
        return bson.ObjectId(value);
      })
    },
  },
  customValidators: {
    isValidObjectId: (value) => {
      return bson.ObjectId.isValid(value);
    },
    areValidObjectIds: (values) => {
      if(!Array.isArray(values))
        return false;

      return values.every(value => {
        return bson.ObjectId.isValid(value);
      })
    },
    isNumber: (value) => {
      return typeof value == "number"
    },
    isArrayOfStrings: (value) => {
      if(!Array.isArray(value))
        return false;

      return value.every(value => {
          return typeof value === "string";
        })
    },
    isArrayOfNumbers: (values) => {
      if(!Array.isArray(values))
        return false;

      return values.every(value => {
        return typeof value === "number";
      })
    }
  }
}));

mongodb.MongoClient.connect(process.env.MONGODB_URI, (err, db) => {
  assert.equal(err, null);
  app.locals.db = db;
  //create initial indexes here
})

app.use('/',Route);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).json(err);
});

module.exports = app;