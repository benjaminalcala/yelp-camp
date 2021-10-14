const express = require('express');
const router = express.Router({mergeParams: true});

const Campground = require('../models/campgrounds');
const Review = require('../models/reviews');
const asyncCatch = require('../utils/asyncCatch');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');
const reviews = require('../controllers/reviews');


router.delete('/:reviewId', isLoggedIn, isReviewAuthor, asyncCatch(reviews.deleteReview))


router.post('/', isLoggedIn, validateReview, asyncCatch(reviews.createReview))

module.exports = router;