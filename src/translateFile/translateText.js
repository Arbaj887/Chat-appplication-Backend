const {Translate} = require('translate')
const fetch = require("node-fetch")


async function translateText (text,translate_to){
    try{

          Translate.engine='libre'
        const text_translate = await fetch(Translate(text,translate_to))

        return text_translate

    }catch(err){
        console.log(err)
    }

}
module.exports= translateText;

