const mongoose = require('mongoose')
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Enter Your name"],
    },
    email:{
        type:String,
        required:[true, "Enter Your Email"],
        unique:true,
        lowercase:[true,"Enter in lower case"],
        
    },
    password:{
        type:String,
        required:[true,"Enter Password"],

    },
    phone_number:{
        type: Number,
        required:[true,"Enter valid number"],
        
    },
    image:{
        type:String,
        default:"https://img.freepik.com/free-photo/space-background-realistic-starry-night-cosmos-shining-stars-milky-way-stardust-color-galaxy_1258-154643.jpg",
    },
    language:{
        type:String,
        default:"English",
    },
    friend:[{
        image:{
            type:String,
            default:"https://img.freepik.com/free-photo/space-background-realistic-starry-night-cosmos-shining-stars-milky-way-stardust-color-galaxy_1258-154643.jpg",
        },
        name:{
            type:String,
             
        },
        email:{
          
            type:String,
            lowercase:true
        }
    }],
    
    friendRequest:[{
        image:{
            type:String,
            default:"https://img.freepik.com/free-photo/space-background-realistic-starry-night-cosmos-shining-stars-milky-way-stardust-color-galaxy_1258-154643.jpg",
        },
        name:{
            type:String,
             
        },
        email:{
          
            type:String,
            lowercase:true
        }
    },

    ],
    
    
},
{timestamps:true},

)



module.exports = mongoose.model("userDetail",userSchema)