let express = require('express')
let router = express.Router();
let Eerror = require('../utils/Eerror')
const catchAsync = require('../utils/catchAsync');
let Review = require('../models/review');
const { reviewSchema } = require('../schemas');
let campquest = require('../models/campquest');

let Joi = require('joi');




const validateReview = (req,res,next) =>{
    let {error} = reviewSchema.validate(req.body)
    if(error){
        let msg = error.details.map(el => el.message).join(',');
        throw new Eerror(msg,400); 
    }
    else{
        next();
    }
 
}


router.post('/:id/reviews',validateReview, catchAsync(async(req,res) =>{
    let camp = await campquest.findById(req.params.id);
    let review = new Review(req.body.review)
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    res.redirect(`/campquests/${camp._id}`)
    
}))
router.delete('/:id/reviews/:reviewId',catchAsync(async(req,res) => {
    const{id,reviewId} = req.params;
    await campquest.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campquests/${id}`);
}))

module.exports = router;
