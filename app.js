const path = require("path");
const express = require("express");

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

app.get("/api/hello/:visitor_name", (req, res) => {
  let ip = req.socket.remoteAddress || req.headers["x-forwarded-for"];
  res.status(200).json({
    status: "success",
    data: {
      client_ip: `${ip}`, // The IP address of the requester
      location: `New York`, // The city of the requester
      greeting: `Hello, ${req.params.visitor_name}!, the temperature is 11 degrees Celcius in New York`,
    },
  });
});

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
