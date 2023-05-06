

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');
var projectRouter = require('./routes/projects');
var excavationRouter = require('./routes/excavations');
var sectionRouter = require('./routes/sections');
var artifactRouter = require("./routes/artifacts");
var featureRouter = require("./routes/features");
var sampleRouter = require("./routes/samples");
var modelRouter = require("./routes/models");
var contactRouter = require("./routes/contacts");
var dateRouter = require("./routes/dates");
var colorRouter = require('./routes/colors');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.set('view engine', 'pug');

app.use('/', indexRouter);
app.use('/projects', projectRouter);
app.use('/excavations', excavationRouter);
app.use("/sections", sectionRouter);
app.use("/artifacts", artifactRouter);
app.use("/features", featureRouter);
app.use("/samples", sampleRouter);
app.use("/models", modelRouter);
app.use("/contacts", contactRouter);
app.use("/dates", dateRouter);
app.use("/colors", colorRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server started on port ${port}`));


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
