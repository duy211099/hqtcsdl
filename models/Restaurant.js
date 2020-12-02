const mongoose = require("mongoose");

const restaurantSchema = {
    name: String,
    cuisine: String,
    stars: Number,
    quality:{
        reviews: Number,
    }
  };
  
const Restaurant = mongoose.model("Restaurant", restaurantSchema);