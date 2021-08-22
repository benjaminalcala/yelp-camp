const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const campgroundSchema = new Schema({
  title: String,
  description: String,
  image: String,
  price: Number,
  location: String
})


const Campground = mongoose.model('Campground', campgroundSchema)

module.exports = Campground;