const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const passport = require("passport");
const { jwtStrategy } = require("./config/passport");
const routes = require("./routes/v1");
// const ApiError = require("./utils/ApiError");

const app = express();

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// enable cors
app.use(cors());
app.options("*", cors());

// jwt authentication
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

// Getting status of application and version
app.get("/", (req, res) => {
  const serverStatus = {
    name: "Auth app",
    status: "UP",
    version: "1.0.0",
  };
  res.status(200).json(serverStatus);
});

// v1 api routes
app.use("/v1", routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new Error("Not found"));
});

module.exports = app;
