const path = require("path");
const express = require("express");
var geoip = require("geoip-lite");

const cors = require("cors");

require("dotenv").config();

const middlewares = require("./middleware");

const app = express();

// body parser
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`App runnung on port ${port}`);
});

// server.listen

app.use((req, res, next) => {
  req.visitorIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  next();
});

app.get("/api/hello", (req, res) => {
  const visitorIp = req.visitorIp;

  const geo = geoip.lookup(visitorIp);
  let city = geo?.city;

  const visitorsName = req.query.visitors_name
    ? req.query.visitors_name
    : "Visitor";

  res.status(200).json({
    status: "success",
    data: {
      client_ip: visitorIp, // The IP address of the requester
      location: city, // The city of the requester
      greeting: `Hello, ${visitorsName}!, the temperature is 11 degrees Celcius in ${city}`,
    },
  });
});

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
