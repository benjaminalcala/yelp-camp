const Campground = require('../models/campgrounds');
const Review = require('../models/reviews');

module.exports.deleteReview = async (req, res) => {
  const {id, reviewId} = req.params;
  await Review.findByIdAndDelete(reviewId);
  await Campground.findByIdAndUpdate(id, {$pull:{reviews: reviewId}})
  req.flash('success', 'Successfully deleted review')
  res.redirect(`/campgrounds/${id}`);
  
}

module.exports.createReview = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  campground.reviews.push(review);
  await campground.save()
  await review.save()
  req.flash('success', 'Created new review')
  res.redirect(`/campgrounds/${campground._id}`)

}