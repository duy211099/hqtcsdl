//jshint esversion:6
require("./models/Restaurant");

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');

const mongoose = require("mongoose");

const Restaurant = mongoose.model('Restaurant');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/demo", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var posts = [];

app.get('/', async function (req, res) {

  const restaurants = await Restaurant
    .find()
    .sort()
    .limit(20);

  res.render('home', {
    startingContent: restaurants
  });
});

app.get('/demo', async function (req, res) {

  const restaurants = await Restaurant
    .find({ "quality.reviews": { $gt: "50000" }, cuisine: "Sushi" })
    .sort({ stars: -1 });

  const getInfo = await Restaurant.find({ "quality.reviews": { $gt: "50000" }, cuisine: "Sushi" }).sort({ stars: -1 }).explain();

  const info = getInfo[0].executionStats;

  res.render('demo', {
    startingContent: restaurants,
    info: info
  });
});

app.get('/restaurant/:id', async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  res.status(200).render('post', {
    post: restaurant
  })
})

app.post('/restaurant/:id', async (req, res) => {
  const restaurant = await Restaurant.findOne({ _id: req.params.id });

  try {
    restaurant.name = req.body.name;
    restaurant.cuisine = req.body.cuisine;
    await restaurant.save();
    res.redirect('/');
  }
  catch (err) {
    return res.status(422).send({ error: 'Invalid old password' });
  }

})



app.listen(3000, function () {
  console.log("Server started on port 3000.");
});
