const express = require('express');
const router = express.Router();
const multer = require('multer');



const Campground = require('../models/campgrounds');
const asyncCatch = require('../utils/asyncCatch');
const {isLoggedIn, validateCampground, isAuthor} = require('../middleware');
const campgrounds = require('../controllers/campgrounds');
const {storage} = require('../cloudinary');
const upload = multer({ storage });




router.get('/', asyncCatch(campgrounds.index))

router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.get('/:id', asyncCatch(campgrounds.renderDetails))

router.post('/', isLoggedIn, upload.array('image'), validateCampground, asyncCatch(campgrounds.createCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, asyncCatch(campgrounds.renderEditForm))

router.put('/:id', isLoggedIn, isAuthor, upload.array('image'), asyncCatch(campgrounds.editCampground))

router.delete('/:id', isLoggedIn, isAuthor, asyncCatch(campgrounds.deleteCampground))

module.exports = router;