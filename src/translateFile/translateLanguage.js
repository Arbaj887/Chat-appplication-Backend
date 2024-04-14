const userDetail = require('../models/userDetail.model.js')


async function translateLanguage(email){
try{
    const language = await userDetail.findOne({ email: email})

    
   return  (language.language)

  } catch (err) {
     console.error("Error during translating:", err);
     
   }
}
module.exports= translateLanguage;