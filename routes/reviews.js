const express = require('express');
const router = express.Router({mergeParams: true});

const Campground = require('../models/campgrounds');
const Review = require('../models/reviews');
const asyncCatch = require('../utils/asyncCatch');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');


router.delete('/:reviewId', isLoggedIn, isReviewAuthor, asyncCatch(async (req, res) => {
  const {id, reviewId} = req.params;
  await Review.findByIdAndDelete(reviewId);
  await Campground.findByIdAndUpdate(id, {$pull:{reviews: reviewId}})
  req.flash('success', 'Successfully deleted review')
  res.redirect(`/campgrounds/${id}`);
  
}))


router.post('/', isLoggedIn, validateReview, asyncCatch(async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  campground.reviews.push(review);
  await campground.save()
  await review.save()
  req.flash('success', 'Created new review')
  res.redirect(`/campgrounds/${campground._id}`)

}))

module.exports = router;