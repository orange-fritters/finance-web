var express = require("express");
var path = require("path");
var axios = require("axios");
const cors = require("cors");
const session = require("express-session");
// const mongoose = require("mongoose");

var app = express();

app.use(cors({ credentials: true, origin: "http://10.0.2.2:3000" }));
app.use(express.static(path.join(__dirname, "../frontend/build")));
app.use(
  session({
    secret: "MySecret",
    resave: false,
    saveUninitialized: true,
  })
);

app.get("/api/home-predict", (req, res) => {
  axios
    .get("http://0.0.0.0:8001/home-predictions")
    .then((response) => res.json(response.data))
    .catch((error) => res.json({ error: error.message }));
});

//* Sentiment Page API //
app.get("/api/sentiment-historical/:id", (req, res) => {
  axios
    .get("http://0.0.0.0:8001/tweets-plot/" + req.params.id)
    .then((response) => res.json(response.data))
    .catch((error) => res.json({ error: error.message }));
});

app.get("/api/sentiment-bar", (req, res) => {
  axios
    .get("http://0.0.0.0:8001/sentiment-bar")
    .then((response) => res.json(response.data))
    .catch((error) => res.json({ error: error.message }));
});

app.get("/api/sentiment-pie", (req, res) => {
  axios
    .get("http://0.0.0.0:8001/sentiment-donut")
    .then((response) => res.json(response.data))
    .catch((error) => res.json({ error: error.message }));
});

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

app.listen(3000, "0.0.0.0", () => {
  console.log("Server started on port 3000");
  console.log(path.join(__dirname, "../frontend/build/index.html"));
});

module.exports = app;
