let express = require('express');
const router = express.Router();
const Review = require('../models/review');
let {campgroundSchema,reviewSchema} = require('../schemas.js')
const catchAsync = require('../utils/catchAsync');
let Eerror = require('../utils/Eerror')
let campquest = require('../models/campquest');
let {isLoggedIn} = require('../middleware');

let validateCampground = (req,res,next) => {
   
    let {error} = campgroundSchema.validate(req.body);
    if(error){
        let msg = error.details.map(el => el.message).join(',');
        throw new Eerror(msg,400);
    }
    else{
        next();
    }
}


router.get('/new',isLoggedIn , (req,res) => {
    res.render('campquests/new');
   
})
router.post('/', validateCampground,catchAsync( async (req,res,next) => {
//   if(!req.body.camp) throw new Eerror('invalid campground data',400);
   let newcamp = new campquest(req.body.camp);
    await  newcamp.save()
    res.redirect(`/campquests/${newcamp._id}`)

}))




router.get('/' ,catchAsync( async(req,res) => {
  
    let campquests = await campquest.find({})
    res.render('campquests/index', {campquests});

}))

router.get('/:id',isLoggedIn,catchAsync( async (req,res) => {
    let {id} =   req.params;
    let camp = await campquest.findById(id).populate('reviews');
    console.log(camp);
    res.render('campquests/show', {camp});

}))

router.get('/:id/edit',isLoggedIn,catchAsync( async (req,res) => {
    let {id} =  req.params;
    let camp = await campquest.findById(id);
    res.render('campquests/edit' , {camp});

}))
router.put('/:id', validateCampground , catchAsync( async (req,res) => {
    let {id} = req.params;
    // or let camp =  req.body.campp;
    let {camp} = req.body
     let updatedcamp = await campquest.findByIdAndUpdate(id , camp)
    // let updatedcamp = await campquest.findByIdAndUpdate( id,{...req.body.campp})
    res.redirect(`/campquests/${updatedcamp._id}`)

} ))

router.delete('/:id' ,catchAsync( async(req,res) => {
    let {id} = req.params;
    await campquest.findByIdAndDelete(id);
    res.redirect('/campquests')
}))

module.exports = router;

