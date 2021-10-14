const Campground = require('../models/campgrounds');
const {cloudinary} = require('../cloudinary');

module.exports.index = async(req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campground/index', {campgrounds})
 
}

module.exports.renderNewForm = (req, res) => {
  res.render('campground/new')
}

module.exports.renderDetails = async (req, res) => {
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
}

module.exports.createCampground = async (req, res) => {
  const campground = new Campground({...req.body.campground});
  campground.images = req.files.map(f => ({url: f.path, filename: f.filename}))
  campground.author = req.user._id;
  await campground.save();
  req.flash('success', 'Created a new campground')
  res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.renderEditForm = async (req, res) => {
  const {id} = req.params;
  const campground = await Campground.findById(id);
  if(!campground){
    req.flash('error', 'Cannot find that campground')
    return res.redirect('/campgrounds')
  }
  res.render('campground/edit', {campground});

}

module.exports.editCampground = async (req, res) => {
  const {id} = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground})
  const imgs = req.files.map(f => ({url: f.path, filename: f.filename}))
  campground.images.push(...imgs);
  await campground.save();
  if(req.body.deleteImages){
    for(let filename of req.body.deleteImages){
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
  }
  console.log(req.body)
  req.flash('success', 'Successfully updated campground')
  res.redirect(`/campgrounds/${id}`)
}

module.exports.deleteCampground = async (req, res) => {
  const {id} = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted campground')
  res.redirect('/campgrounds');
}