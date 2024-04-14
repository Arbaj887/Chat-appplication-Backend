const express = require('express')
const app = express()
const cors= require('cors')
const mongoose = require('mongoose')
const userRoutes = require('./routes/userRoutes.js')
const globalRoutes = require('./routes/globalRoutes.js')
const messagesRoutes= require('./routes/messagesRoutes.js')
const { Server} = require('socket.io')
const {translateLanguage}= require('./translateFile/translateLanguage.js')
const { translateText} = require('./translateFile/translateText.js')


require('dotenv').config()

app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(userRoutes)
app.use(globalRoutes)
app.use(messagesRoutes)


//-------------------------------mongoDb ---connection-------------------------------------
try{
mongoose.connect(`${process.env.MONGODB_URL}`).then(()=>{
  console.log("mongo connected")
  
})
 

}
catch(err){
  console.log('DataBase is not connected')
}





const server= app.listen(process.env.PORT,()=>{
  console.log("port listining",process.env.PORT)
  
  
})

const io = new Server(server,{
  cors:{
  origin:process.env.CORS,
  credentials:true

  }
})
io.on('connection',(socket)=>{
   console.log('hey user Connect',socket.id)

   socket.on('join', function (data) {
    
    socket.join(data.email);
   })
   socket.on('send_message',async (data)=>{

    await translateLanguage(data.email)

    await translateText(data.msg , translateLanguage)

    socket.to(data.email).emit('receive_message', translateText);
    
   })

})