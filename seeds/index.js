const mongoose = require('mongoose');
const cities = require('./cities')
const {descriptors, places} = require('./seedHelpers');
const Campground = require('../models/campgrounds');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {useNewUrlParser: true})
.then(()=> {
  console.log('Connected')
})
.catch((err) => {
  console.log(err)
})


const createName = arr => {
  return arr[Math.floor(Math.random() * arr.length)];
}

const seedFunction = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++){
    let index = Math.floor(Math.random() * 1000);
    let title = `${createName(descriptors)} ${createName(places)}`;
    let campground = new Campground({location: `${cities[index].city}, ${cities[index].state}`, title})
    await campground.save()
  }

}

seedFunction()