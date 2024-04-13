const mongoose = require('mongoose')
const globalUserSchema =new  mongoose.Schema({
    name:{
        type:String,
        required:[true],
    },
    email:{
        type:String,
        required:[true],
        unique:true,
        lowercase:[true],
        
    },
    image:{
        type:String,
        default:"https://img.freepik.com/free-photo/space-background-realistic-starry-night-cosmos-shining-stars-milky-way-stardust-color-galaxy_1258-154643.jpg",
    },

},{timestamps:true,})

module.exports = mongoose.model("globalUser",globalUserSchema)