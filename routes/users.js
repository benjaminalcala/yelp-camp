const express = require('express');
const router = express.Router();
const passport = require('passport');

const User = require('../models/users');
const asyncCatch = require('../utils/asyncCatch');


router.get('/register', (req, res) => {
  res.render('users/register');
})

router.post('/register', asyncCatch(async (req, res) => {
  try{
    const {username, email, password} = req.body;
    const user = new User({username, email});
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => {
      if(err) return next(err)
      req.flash('success', 'Welcome to Yelp Camp');
      res.redirect('/campgrounds')
    })
    

  }
  catch(e){
    req.flash('error', e.message);
    res.redirect('/register')
  }
}))

router.get('/login', (req, res) => {
  res.render('users/login')
})

router.post('/login', passport.authenticate('local', {failureRedirect: '/login', failureFlash: true}), (req, res) => {
  req.flash('success', 'Welcome back');
  const redirectUrl = req.session.returnTo || '/campgrounds';
  delete req.session.returnTo;
  res.redirect(redirectUrl);
})

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'Goodbye');
  res.redirect('/campgrounds');

})

module.exports = router;