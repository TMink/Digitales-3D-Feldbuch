require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

const mongoose = require("mongoose");
const connectDB = require('./dbConn');


// Connect to MongoDB
connectDB();

var indexRouter = require("./routes/index");
var activityRouter = require("./routes/activities");
var placeRouter = require("./routes/places");
var positionRouter = require("./routes/positions");
var modelRouter = require("./routes/models");
var imageRouter = require("./routes/images");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.set("view engine", "pug");

app.use("/", indexRouter);


app.use("/activities", activityRouter);
app.use("/places", placeRouter);
app.use("/positions", positionRouter);
app.use("/models", modelRouter);
app.use("/images", imageRouter);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

const port = process.env.PORT || 3000;

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(port, () => console.log(`Server started on port ${port}`));
})



// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
