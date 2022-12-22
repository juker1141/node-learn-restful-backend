const path = require("path");

const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");

const feedRoutes = require("./routes/feed");

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, `${new Date().toISOString()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {};

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(express.json()); // application/json

app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message });
});

mongoose
  .connect(
    "mongodb+srv://Ryu:OHY2n7uzgjTkhqR2@shop.7gk0cbz.mongodb.net/messages?retryWrites=true&w=majority"
  )
  .then((result) => {
    app.listen(8080);
  })
  .catch((err) => {
    console.log(err);
  });
