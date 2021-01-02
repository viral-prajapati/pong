const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const { request } = require("express");
const mongoose = require("mongoose");

const app = express();
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/GamesDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const userSchema = {
  name: String,
  uid: String,
  psw: String,
  score: Number,
};

const User = mongoose.model("User", userSchema);

app.get("/", function (request, response) {
  response.render("home", {});
});

app.get("/signup", function (request, response) {
  response.render("SignUp", {});
});

app.get("/game/:id.:uScore", function (request, response) {
  // console.log(request.params);
  var uid = request.params.id;
  var uScore = Number(request.params.uScore);
  User.find({}, function (err, users) {
    User.findOne({ uid: uid }, "name score", function (err, userScore) {
      console.log(userScore);
      if (err) {
        console.log(err);
      } else {
        if (userScore.score < uScore) {
          User.update(
            { uid: uid },
            { $set: { score: uScore } },
            { upsert: true },
            function (err) {
              if (err) {
                console.log(err);
              }
            }
          );
        }
        response.render("game", {
          user: uid,
          name:userScore.name,
          bestScore: userScore.score,
          data: users,
        });
      }
    });
  });
});

app.post("/", function (request, response) {
  const uid = request.body.uid;
  const psw = request.body.Psw;
  User.find({}, function (err, data) {
    if (!err) {
      console.log(data);
      data.map(function (item) {
        if (item.uid == uid && item.psw == psw) {
          let uScore = item.score;
          response.render("Wait", { user: uid, userScore: uScore });
        }
      });
    } else {
      console.log(err);
    }
  });
});

app.post("/signup", function (request, response) {
  const name = request.body.name;
  const uid = request.body.uid;
  const psw1 = request.body.Psw1;
  const psw2 = request.body.Psw2;
  if (psw1 == "") {
    response.status(204).send();
  }
  let score = 0;
  const user = new User({
    name: name,
    uid: uid,
    psw: psw1,
    score: 0,
  });
  user.save(function (err) {
    if (!err) {
      response.render("Wait", { user: uid, userScore: score });
    } else {
      response.status(204).send();
    }
  });
});

app.listen(80, function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Server started");
  }
});
