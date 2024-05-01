const userDetail = require('../models/userDetail.model.js')


async function translateLanguage(email,){
try{
    const to = await userDetail.findOne({ email: email})
     
     
   return  (to.language)

  } catch (err) {
     console.error("Error during translating:", err);
     
   }
}
module.exports= translateLanguage;