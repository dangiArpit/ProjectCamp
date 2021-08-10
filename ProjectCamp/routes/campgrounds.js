const express = require('express');
const router = express.Router();
const {campgroundSchema} = require('../schemas.js');
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const ExpressErrror = require('../utils/ExpressError');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware.js');


router.get('/',catchAsync(async(req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{ campgrounds });
}));
router.get('/new',isLoggedIn,(req,res)=>{
    res.render('campgrounds/new');
});
router.post('/',validateCampground,isLoggedIn,catchAsync(async(req,res,next)=>{
    
    const camp = new Campground(req.body.campground);
    camp.author = req.user._id;
    await camp.save();
    req.flash('success','Successfully made a new campground');
    res.redirect(`/campgrounds/${camp._id}`); 
}));
router.get('/:id',catchAsync(async(req,res)=>{
    const {id} = req.params;
    const campground  = await Campground.findById(id).populate('reviews').populate('author');
    // console.log(campground);
    if(!campground){
        req.flash('error','Cannot find that campground');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/show',{campground})
}));
router.put('/:id',validateCampground,isLoggedIn,isAuthor,catchAsync(async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    req.flash('success','Successfully updated Campground');
    res.redirect(`/campgrounds/${campground._id}`)
}));

router.get('/:id/edit',isLoggedIn, isAuthor, catchAsync(async(req,res)=>{
    const {id} = req.params;
    const campground  = await Campground.findById(id);
    res.render('campgrounds/edit',{campground})
}));
router.delete('/:id',isLoggedIn,isAuthor, catchAsync(async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully deleted campground');
    res.redirect('/campgrounds');
}))

module.exports = router;