const express = require('express');
const router = express.Router({mergeParams : true});
const {reviewSchema} = require('../schemas.js');
const Review = require('../models/review');
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const ExpressErrror = require('../utils/ExpressError');
const {validateReview} = require('../middleware');

router.post('/',validateReview ,catchAsync(async(req,res)=>{
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success','Review Added');
    res.redirect(`/campgrounds/${campground._id}`);
 }))
 router.delete('/:reviewId', catchAsync(async(req,res) =>{
     const {id,reviewId} = req.params;
     await Campground.findByIdAndUpdate(id,{ $pull :{reviews : reviewId}});//good method of deleting array 
     await Review.findByIdAndDelete(reviewId);//object with a particular match
     req.flash('success','Review Deleted');
     res.redirect(`/campgrounds/${id}`);
 }))

 module.exports = router;