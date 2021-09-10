const mongoose = require('mongoose');
const Review = require('./reviews');
const Schema = mongoose.Schema;

const campgroundSchema = new Schema({
  title: String,
  description: String,
  image: String,
  price: Number,
  location: String,
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: 'Review'
  }]
})

campgroundSchema.post('findOneAndDelete', async function(doc){
  if(doc){
    await Review.deleteMany({
      _id: {
        $in: doc.reviews
      }
    })
  }
})


const Campground = mongoose.model('Campground', campgroundSchema)

module.exports = Campground;