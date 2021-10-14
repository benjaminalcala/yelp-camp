const express = require('express');
const router = express.Router();
const passport = require('passport');

const User = require('../models/users');
const asyncCatch = require('../utils/asyncCatch');
const users = require('../controllers/users')


router.get('/register', users.renderRegisterForm);

router.post('/register', asyncCatch(users.registerNewUser))

router.get('/login', users.renderLoginForm);

router.post('/login', passport.authenticate('local', {failureRedirect: '/login', failureFlash: true}), users.login)

router.get('/logout', users.logout)

module.exports = router;