var createError = require("http-errors");
var express = require("express");
var path = require("path");
const { initializeSocket, getSocketIO } = require("./socketHandler");
const http = require("http");
var logger = require("morgan");
const cors = require("cors");
const passport = require("passport");
require("dotenv").config();
var flash = require("connect-flash");

var app = express();
const server = http.createServer(app);

app.use(cors());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(logger("dev"));
app.use(flash());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/css", express.static(path.join(__dirname, "public/css")));
app.use("/js", express.static(path.join(__dirname, "public/js")));
app.use("/images", express.static(path.join(__dirname, "public/images")));

app.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  next();
});

// Configure express-session
require("./config/sessionConfig")(app);
// Configure Passport
app.use(passport.initialize());
app.use(passport.session());
require("./config/passportConfig")();

initializeSocket(server);

//routes
require("./config/routesConfig")(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

require("./config/db")();

const io = getSocketIO();
io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(5000, () => {
  console.log("server is running on port: 5000");
});
