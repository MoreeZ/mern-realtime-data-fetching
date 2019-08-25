const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const express = require("express");

const app = express();

const User = require("./models/user.model");

const config = require("./config");

const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

const connectConfig = { useNewUrlParser: true, useCreateIndex: true };

const fetchMongoDb = action => {
  mongoose
    .connect(config.uri, connectConfig)
    .then(() => {
      action(mongoose.connection);
    })
    .then(() => {
      mongoose.disconnect();
    })
    .catch(err => console.log("FAILED TO CONNECT!!!", err));
};

app.post("/api/getdata", (req, res) => {
  fetchMongoDb(connection => {
    const db = connection.useDb("myDatabases");
    const users = db.collection("users");
    users.find().toArray(function(err, result) {
      if (err) throw res.json(err);
      else {
        console.log(result);
        res.json([...result]);
      }
    });
  });
});

app.post("/api/adduser", (req, res) => {
  console.log("/api/adduser POST REQUEST STAGE 1");
  const name = req.body.name;
  const newUser = new User({ name });
  newUser.save((err, user) => {
    if (err) console.log("___failed save: ", err);
    res.json(err || user);
  });
});

app.listen(PORT, () => {
  console.log("Server is running");
});
