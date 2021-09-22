const express = require('express');
const router = express.Router();

const Campground = require('../models/campgrounds');

const ExpressError = require('../utils/ExpressError');
const asyncCatch = require('../utils/asyncCatch');
const {campgroundSchema} = require('../schemas');

const validateCampground = (req, res, next) => {
  const {error} = campgroundSchema.validate(req.body);
  if(error){
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(400, msg)
  }else{
    next()
  }
}

router.get('/', asyncCatch(async(req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campground/index', {campgrounds})
 
}))

router.get('/new', (req, res) => {
  res.render('campground/new')
})

router.get('/:id', asyncCatch(async (req, res) => {
  const {id} = req.params;
  const campground = await Campground.findById(id).populate('reviews');
  if(!campground){
    req.flash('error', 'Cannot find that campground')
    return res.redirect('/campgrounds')
  }
  res.render('campground/details', {campground})
}))


router.post('/', validateCampground, asyncCatch(async (req, res) => {
  const campground = new Campground({...req.body.campground});
  await campground.save();
  req.flash('success', 'Created a new campground')
  res.redirect(`/campgrounds/${campground._id}`)
}))

router.get('/:id/edit', asyncCatch(async (req, res) => {
  const {id} = req.params;
  const campground = await Campground.findById(id);
  if(!campground){
    req.flash('error', 'Cannot find that campground')
    return res.redirect('/campgrounds')
  }
  res.render('campground/edit', {campground});

}))

router.put('/:id', asyncCatch(async (req, res) => {
  const {id} = req.params;
  await Campground.findByIdAndUpdate(id, {...req.body.campground})
  req.flash('success', 'Successfully updated campground')
  res.redirect(`/campgrounds/${id}`)
}))

router.delete('/:id', asyncCatch(async (req, res) => {
  const {id} = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted campground')
  res.redirect('/campgrounds');
}))

module.exports = router;