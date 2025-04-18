require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
var sessionStorage = require("sessionstorage");
const app = express();
const mongodb = require("./mongodb");
const mongoose = require('mongoose');
app.use(cors());
const post = require("./src/post/post.route");
mongodb.init().then((db) => {
  console.log("**************db****");
  app.locals.database = db;
});
app.use(bodyParser.json());
app.use(bodyParser.json({ limit: "300mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "300mb",
    extended: true,
    parameterLimit: 90000,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
sessionStorage.setItem("srcFolderPath", __dirname);
app.use("/", express.static(path.join(__dirname, "views")));
app.use("/v0.1/upload", post);
app.use(function (req, res) {
  res.status(404).send({
    status: 404,
    url: req.originalUrl,
    error: "Not found",
  });
});

module.exports = app;
