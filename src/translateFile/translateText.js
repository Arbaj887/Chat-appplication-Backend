
async function translateText(text, translate_to,) {
    try {

        const result = await fetch(`https://api.mymemory.translated.net/get?q=${text}&langpair=autodetect|${translate_to}`)
       const translated =await result.json();
        // Return the translated text
        if(translated.responseData.translatedText==="PLEASE SELECT TWO DISTINCT LANGUAGES")
        {
            return text
        }
        
        return translated.responseData.translatedText;
    } catch (error) {
       // If an error occurs, log it for debugging purposes
        console.error('Translation error:', error);
        // Return null or throw the error depending on your application's requirements
        return text;
    }
}




module.exports = translateText;

