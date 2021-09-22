const express = require('express');
const router = express.Router({mergeParams: true});

const Campground = require('../models/campgrounds');
const Review = require('../models/reviews');
const ExpressError = require('../utils/ExpressError');
const asyncCatch = require('../utils/asyncCatch');
const {reviewSchema} = require('../schemas');

const validateReview = (req, res, next) => {
  const {error} = reviewSchema.validate(req.body);
  if(error){
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(400, msg)
  }else{
    next()
  }
}

router.delete('/:reviewId', asyncCatch(async (req, res) => {
  const {id, reviewId} = req.params;
  await Review.findByIdAndDelete(reviewId);
  await Campground.findByIdAndUpdate(id, {$pull:{reviews: reviewId}})
  req.flash('success', 'Successfully deleted review')
  res.redirect(`/campgrounds/${id}`);
  
}))


router.post('/', validateReview, asyncCatch(async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  campground.reviews.push(review);
  await campground.save()
  await review.save()
  req.flash('success', 'Created new review')
  res.redirect(`/campgrounds/${campground._id}`)

}))

module.exports = router;