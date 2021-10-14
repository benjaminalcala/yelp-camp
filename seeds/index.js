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
    let price = Math.floor(Math.random() * 20) + 10;
    let index = Math.floor(Math.random() * 1000);
    let title = `${createName(descriptors)} ${createName(places)}`;
    let author = '6152722eee69423806d0cd3c';
    let images = [
      {
      
        url: 'https://res.cloudinary.com/dlxjoimgn/image/upload/v1633566141/YelpCamp/udtfapvuncr6pqg6yy7y.jpg',
        filename: 'YelpCamp/udtfapvuncr6pqg6yy7y'
      },
      {
        url: 'https://res.cloudinary.com/dlxjoimgn/image/upload/v1633566141/YelpCamp/kajgbkvrz6oyruxp2csx.jpg',
        filename: 'YelpCamp/kajgbkvrz6oyruxp2csx'
      }
    ]
    let campground = new Campground({location: `${cities[index].city}, ${cities[index].state}`, title, price, author,
    images, description: 'A beautiful place to camp, you can either camp in a tent or in one of the beautiful log cabins'})
    await campground.save()
  }

}

seedFunction()