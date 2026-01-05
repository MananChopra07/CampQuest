let mongoose = require('mongoose');
const Review = require('./review');
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
CampquestSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
   
})
module.exports = mongoose.model('campquest', CampquestSchema);
