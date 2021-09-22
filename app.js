const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const Joi = require('joi');
const session = require('express-session');
const flash = require('connect-flash')

const ExpressError = require('./utils/ExpressError');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
  useNewUrlParser: true,
useCreateIndex: true,
useUnifiedTopology: true})
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

app.use(express.static(path.join(__dirname, 'public')))

app.use(session({
  secret: 'secretkey',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
   }
}))
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error');
  next()
})

app.use('/campgrounds',campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes )


app.get('/', (req, res) => {
  res.send('Home Page')
})

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