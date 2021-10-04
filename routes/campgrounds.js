const express = require('express');
const router = express.Router();

const Campground = require('../models/campgrounds');
const asyncCatch = require('../utils/asyncCatch');
const {isLoggedIn, validateCampground, isAuthor} = require('../middleware');



router.get('/', asyncCatch(async(req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campground/index', {campgrounds})
 
}))

router.get('/new', isLoggedIn, (req, res) => {
  res.render('campground/new')
})

router.get('/:id', asyncCatch(async (req, res) => {
  const {id} = req.params;
  const campground = await Campground.findById(id).populate({
    path: 'reviews',
    populate: {
      path: 'author'
    }
  }).populate('author');
  if(!campground){
    req.flash('error', 'Cannot find that campground')
    return res.redirect('/campgrounds')
  }
  res.render('campground/details', {campground})
}))


router.post('/', isLoggedIn, validateCampground, asyncCatch(async (req, res) => {
  const campground = new Campground({...req.body.campground});
  campground.author = req.user._id;
  await campground.save();
  req.flash('success', 'Created a new campground')
  res.redirect(`/campgrounds/${campground._id}`)
}))

router.get('/:id/edit', isLoggedIn, isAuthor, asyncCatch(async (req, res) => {
  const {id} = req.params;
  const campground = await Campground.findById(id);
  if(!campground){
    req.flash('error', 'Cannot find that campground')
    return res.redirect('/campgrounds')
  }
  res.render('campground/edit', {campground});

}))

router.put('/:id', isLoggedIn, isAuthor, asyncCatch(async (req, res) => {
  const {id} = req.params;
  await Campground.findByIdAndUpdate(id, {...req.body.campground})
  req.flash('success', 'Successfully updated campground')
  res.redirect(`/campgrounds/${id}`)
}))

router.delete('/:id', isLoggedIn, isAuthor, asyncCatch(async (req, res) => {
  const {id} = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted campground')
  res.redirect('/campgrounds');
}))

module.exports = router;