let express = require('express')
let ejsMate = require('ejs-mate');
let catchAsync = require('./utils/catchAsync');
let app =  express();
let mongoose = require('mongoose')
let methodOverride = require('method-override')
let {campgroundSchema} = require('./schemas.js')
let Joi = require('joi');
app.use(methodOverride('_method'))
app.engine('ejs', ejsMate);
let campquest = require('./models/campquest');
mongoose.connect('mongodb+srv://MananChopra07:NoraChopra@cluster0.jtzuajy.mongodb.net/camp-quest?retryWrites=true&w=majority');
let db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error"));
let Eerror = require('./utils/Eerror')
db.once("open" , () => {
    console.log("database connected")

});
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
app.use(express.urlencoded({extended: true}))

let path = require('path')
app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'))

app.get('/',(req,res) => {
    res.render('home');
})
// app.get('/makecampquest', async(req,res) => {
//     let camp = new campquest({title: 'my backyard' , description : "cheap camping"})
//     await camp.save();
//     res.send(camp)

// })
app.get('/campquests/new' , (req,res) => {
    res.render('campquests/new');
})
app.post('/campquests', validateCampground,catchAsync( async (req,res,next) => {
//   if(!req.body.camp) throw new Eerror('invalid campground data',400);
   let newcamp = new campquest(req.body.camp);
    await  newcamp.save()
    res.redirect(`/campquests/${newcamp._id}`)

}))



app.get('/campquests' ,catchAsync( async(req,res) => {
    let campquests = await campquest.find({})
    res.render('campquests/index', {campquests});

}))

app.get('/campquests/:id',catchAsync( async (req,res) => {
    let {id} =   req.params;
    let camp = await campquest.findById(id);
    res.render('campquests/show', {camp});

}))

app.get('/campquests/:id/edit',catchAsync( async (req,res) => {
    let {id} =  req.params;
    let camp = await campquest.findById(id);
    res.render('campquests/edit' , {camp});

}))
app.put('/campquests/:id', validateCampground , catchAsync( async (req,res) => {
    let {id} = req.params;
    // or let camp =  req.body.campp;
    let {camp} = req.body
     let updatedcamp = await campquest.findByIdAndUpdate(id , camp)
    // let updatedcamp = await campquest.findByIdAndUpdate( id,{...req.body.campp})
    res.redirect(`/campquests/${updatedcamp._id}`)

} ))

app.delete('/campquests/:id' ,catchAsync( async(req,res) => {
    let {id} = req.params;
    await campquest.findByIdAndDelete(id);
    res.redirect('/campquests')
}))

app.all(/(.*)/,(req,res,next) => {
    next( new Eerror('page not found',404))
})




app.use((err,req,res,next) => {
    let {statusCode = 500} = err;
    if(! err.message) err.message = "something is wrong";
    res.status(statusCode).render('error',{err});
   
})




const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serving on port ${port}`)
})

