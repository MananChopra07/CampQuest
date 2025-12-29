let mongoose = require('mongoose');
let Schema = mongoose.Schema 
let CampquestSchema = new Schema({
    title: String,
    image : String,
    price : Number,
    description : String , 
    location : String ,
    reviews :[
        {
            type : Schema.Types.ObjectId,
            ref : 'Review'
        }
    ]
});
module.exports = mongoose.model('campquest', CampquestSchema);
