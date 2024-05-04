const express = require('express')
const app = express()
const cors= require('cors')
const mongoose = require('mongoose')
const userRoutes = require('./routes/userRoutes.js')
const globalRoutes = require('./routes/globalRoutes.js')
const messagesRoutes= require('./routes/messagesRoutes.js')
const { Server} = require('socket.io')
const translateLanguage= require('./translateFile/translateLanguage.js')
const translateText = require('./translateFile/translateText.js')


require('dotenv').config()


app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(userRoutes)
app.use(globalRoutes)
app.use(messagesRoutes)

app.use(cors({
  origin: process.env.CORS,
  credentials:true
}));


//-------------------------------mongoDb ---connection-------------------------------------
try{
mongoose.connect(`${process.env.MONGODB_URL}`)
 

}
catch(err){
  
}





const server= app.listen(process.env.PORT || 4000)

const io = new Server(server,
  {
  cors:{
  origin: process.env.CORS,
  
  credentials:true

  }
 
}
)
io.on('connection',(socket)=>{
 

   socket.on('join', function (data) {
    
    socket.join(data.email);
   })

   socket.on('send_message',async (data)=>{

    const translateLang= await translateLanguage(data.email)
    const translateMsg = await translateText(data.msg , translateLang)

   await socket.to(data.email).emit('receive_message', translateMsg);
    
   })

})