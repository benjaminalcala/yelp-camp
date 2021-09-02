const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const Joi = require('joi');

const Campground = require('./models/campgrounds');
const ExpressError = require('./utils/ExpressError');
const asyncCatch = require('./utils/asyncCatch');
const {campgroundSchema} = require('./schemas');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {useNewUrlParser: true})
.then(()=> {
  console.log('Connected')
})
.catch((err) => {
  console.log(err)
})

const app = express();


app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname,'views'))

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'))

const validateCampground = (req, res, next) => {
  const {error} = campgroundSchema.validate(req.body);
  if(error){
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(400, msg)
  }else{
    next()
  }
}

app.get('/', (req, res) => {
  res.send('Home Page')
})

app.get('/campgrounds', asyncCatch(async(req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campground/index', {campgrounds})
 
}))

app.get('/campgrounds/new', (req, res) => {
  res.render('campground/new')
})

app.get('/campgrounds/:id', asyncCatch(async (req, res) => {
  const {id} = req.params;
  const campground = await Campground.findById(id);
  res.render('campground/details', {campground})
}))


app.post('/campgrounds', validateCampground, asyncCatch(async (req, res) => {
  const campground = new Campground({...req.body.campground});
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`)
}))

app.get('/campgrounds/:id/edit', asyncCatch(async (req, res) => {
  const {id} = req.params;
  const campground = await Campground.findById(id);
  res.render('campground/edit', {campground});

}))

app.put('/campgrounds/:id', asyncCatch(async (req, res) => {
  const {id} = req.params;
  await Campground.findByIdAndUpdate(id, {...req.body.campground})
  res.redirect(`/campgrounds/${id}`)
}))

app.delete('/campgrounds/:id', asyncCatch(async (req, res) => {
  const {id} = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect('/campgrounds');
}))

app.all('*', (req, res, next) => {
  next(new ExpressError(404, 'Page not found'))
})

app.use((err, req, res, next) => {
  const {status = 500} = err;
  if(!err.message) message = "Something went wrong";
  res.status(status).render('error', {err})
})

app.listen(3000, () => {
  console.log("listening on port 3000")
})