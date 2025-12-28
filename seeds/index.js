let mongoose = require('mongoose')
let campquest = require('../models/campquest');
mongoose.connect('mongodb://localhost:27017/camp-quest');
let cities = require('./cities')
let {descriptors , places } = require('./seedHelper.js');
let db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error"));
db.once("open" , () => {
    console.log("database connected")

});
let sample = arr => arr[Math.floor(Math.random() * arr.length)];

let seedDB = async() =>{
    await  campquest.deleteMany({});
   
    for( let i = 0 ; i < 50 ; i++){
        let random1000 = Math.floor(Math.random() * 1000); 
        let price = Math.floor(Math.random() * 20) + 10;
        let camp = new campquest({
            location : `${cities[random1000].city},${cities[random1000].state}` , 
            image: `https://picsum.photos/400?random=${Math.random()}`,
            description : 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ducimus, eius! Quas numquam modi, asperiores velit laudantium accusantium, cum nisi nobis tenetur quod cupiditate nulla doloremque eum fugiat veniam eos inventore.',
            price: price,
            // we can also write just price 
            title : `${sample(descriptors)} ${sample(places)}`

        })
        await camp.save();


    }
}
seedDB()
.then(() => {
    mongoose.connection.close()
})