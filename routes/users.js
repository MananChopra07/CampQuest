const express = require('express');
const router = express.Router();
let catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');


router.get('/register', (req,res) => {
    res.render('users/register')
})
router.post('/register', catchAsync(async(req,res) => {
    try{
   let {email,username,password} = req.body;
   let user = new User({email,username})
   let registeredUser = await  User.register(user,password);
   req.login(registeredUser,err => {
    if(err) return next(err);
    req.flash('success','Welcome to Camp Quest!');
    res.redirect('/campquests')
    
   })
   }
   catch(e){
    req.flash('error', e.message);
    res.redirect('/register')
   }
  
}))
router.get('/login', (req,res) => {
    res.render('users/login')
})

router.post('/login',storeReturnTo ,passport.authenticate('local',{failureFlash: true , failureRedirect:'/login'}), (req,res) => {
    req.flash('success','welcome back');
    const redirectUrl = res.locals.returnTo || '/campquests';
  
    res.redirect(redirectUrl);
})
router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campquests');
    });
});

module.exports = router;

