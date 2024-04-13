const router =  require("express").Router()
const globalUser = require('../models/globalUser.model')

router.get('/Global',async function(req,res){

    try{

   const users = await globalUser.find({})
   
   return res.json(users)
    }
    catch(err){
        console.log(err)
    }
})

module.exports = router