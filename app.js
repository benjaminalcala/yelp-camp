const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

const Campground = require('./models/campgrounds');

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

app.get('/', (req, res) => {
  res.send('Home Page')
})

app.get('/campgrounds', async(req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campground/index', {campgrounds})
 
})

app.get('/campgrounds/new', (req, res) => {
  res.render('campground/new')
})

app.get('/campgrounds/:id', async (req, res) => {
  const {id} = req.params;
  const campground = await Campground.findById(id);
  res.render('campground/details', {campground})
})


app.post('/campgrounds', async (req, res) => {
  const campground = new Campground({...req.body.campground});
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`)
})

app.get('/campgrounds/:id/edit', async (req, res) => {
  const {id} = req.params;
  const campground = await Campground.findById(id);
  res.render('campground/edit', {campground});

})

app.put('/campgrounds/:id', async (req, res) => {
  const {id} = req.params;
  await Campground.findByIdAndUpdate(id, {...req.body.campground})
  res.redirect(`/campgrounds/${id}`)
})

app.delete('/campgrounds/:id', async (req, res) => {
  const {id} = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect('/campgrounds');
})

app.listen(3000, () => {
  console.log("listening on port 3000")
})