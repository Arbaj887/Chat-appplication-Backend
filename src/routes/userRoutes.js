const router =  require("express").Router()
const nodemailer = require('nodemailer');
const userDetail = require('../models/userDetail.model.js')
const globalUser = require('../models/globalUser.model.js')



//-----------------------------Login----Route---------------------------------------------
router.post("/Login", async function (req, res){
  const { email, password } = req.body
  
  try{
     const login = await userDetail.findOne({ email: email, password: password })

     if (!login) {
      
      return res.status(401).json({ error: "Invalid  User" });
    }
    // const isPasswordValid = await bcrypt.compare(password, login.password);
    // if (!isPasswordValid) {
    //   return res.status(401).json({ error: "Invalid Password" });
    // }
    return res.json(login)

   } catch (err) {
      console.error("Error during login:", err);
      return res.status(500).json({ error: "An error occurred during login" });
    }

})

//------------------------------SignUp---Route----------------------------------------------

router.post("/SignUp", async function (req, res) {
  const { fileImage, userName, email, password, phoneNumber, language } = req.body
  
  

  try {
     const userExists =await userDetail.exists({email:email})
     

     if(userExists){
      return res.status(400).json({error:'User already exists'})
     }

     await userDetail.create({ image: fileImage, name: userName, email: email, password: password, phone_number: phoneNumber, language:language })
//----------set--User as ------Global--User-----------------------------------------------------------------------------     
     await globalUser.create({image:fileImage,name:userName,email:email})

    return res.status(200).json({message:' Sign Up Successfull'})
  }
  catch (err) {
    return res.status(500).json({error:'Try again Something went Wrong'})
  }


})

//-----------------------Forget---password--Route-----------------------------------------------------------------

router.post("/FargotPassword", async function (req, res) {
  const { email, otp } = req.body


  try {

    const forgetpassword = await userDetail.find({ email: email }).select('password')

    if (forgetpassword.length === 0) {

      return res.send(forgetpassword)
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
      }
    });

    const mailOptions = {
      from: 'choudharyarbaj887@gmail.com',
      to: email,
      subject: 'Forget Password OTP',
      text: `Your OTP  ${otp} /n please do not share it`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    return res.json(forgetpassword)



  }
  catch (err) {
    console.log("cannot find any user", err)
  }


})

//------------------------------------checking--sessionStorage------------------------------------------------
router.post('/sessionCheck', async function(req, res) {
  const { sessionEmail, sessionPassword } = req.body;
  try {
    const sessionCheck = await userDetail.find({ email: sessionEmail, password: sessionPassword });
    
    if (!sessionCheck) {
      
      
      return res.send(false);
    }
    
    
    return res.send(true);
  } catch (err) {
    console.log('error in sessionStorage');
    return res.status(500).send('Internal Server Error');
  }
});


//-------------------------------------Friend---data------------------------------------------------------------

router.post('/Friend', async function (req, res) {
  const {email, password } = req.body

  try {
    const friend = await userDetail.find({ email: email, password: password }).select('friend')


    return res.json(friend)
  } catch (err) {
    console.log(err)
  }
})

//-----------------------------------------Setting-------------------------------------------------------------

router.post('/Setting', async function (req, res) {
  const { email } = req.body

  try {
    const currentValue = await userDetail.find({email:email })
    
    return res.json(currentValue)
  }
  catch (err) {
    console.log('err')
  }
})

//----------------------------------------Setting---Update---------------------------------------------------

router.post('/settingUpdate', async function (req, res) {
  const { email, fileImage, updateName, updatePhone, updatePassword, updateLanguage } = req.body
 
   
  try {
    const updateValue = await userDetail.findOne({ email: email })
   
    updateValue.name = updateName;
    if(fileImage){
    updateValue.image = fileImage;
    }
    updateValue.phone_number = updatePhone;
    updateValue.password = updatePassword;
    updateValue.language = updateLanguage;

    await updateValue.save();
 //-----------------------Updating----User---Friend--list---if---necessary-----------------------------------
 const updateFriendList = await  userDetail.find({'friend.email':email})
 updateFriendList.forEach(async (updateFriend) => {
  updateFriend.friend.forEach((friend) => {
    if (friend.email === email) {
      friend.name = updateName;
      if (fileImage) {
        friend.image = fileImage;
      }
    }
  });
  await updateFriend.save(); // Save each friend individually
});
  
   


 //---------------------For--Global---Update----------------------------------------------------------
     const updateGlobal = await globalUser.findOne({email:email}) 
          updateGlobal.name = updateName
          updateGlobal.image = fileImage;
   
    await updateGlobal.save();
    return res.json(updateValue)
  }
  catch (err) {
    console.log(err)
  }
})
//----------------------------------Send-----Friend--Request------------------------------------------------------

router.post('/FriendRequest', async function (req, res) {
  const { friendEmail, email } = req.body;

  try {
    const senderEmail = await userDetail.findOne({ email: email }).select('email name image');
    const friendRequest = await userDetail.findOne({ email: friendEmail }).select('friendRequest').exec();
    
    if(friendRequest.friendRequest.some(friend => friend.email === email)){
      return res.send('already added')
    }
    friendRequest.friendRequest.push({ name: senderEmail.name, email: senderEmail.email, image: senderEmail.image });

    await friendRequest.save();

    return res.status(200).json(friendRequest);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});
 
//------------------------------get--send------------Friend--Request------------------------------------------------------
router.post('/GetFriendRequest', async function (req, res) {
  const { email } = req.body;

  try {
   
    const getfriendRequest = await userDetail.findOne({ email:email });
    
    
    return res.status(200).json(getfriendRequest.friendRequest);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});
//---------------------------------------Reject---Friend-- Request----------------------------------------------

router.post('/RejectFriendRequest', async function (req, res) {
  const { friendEmail, email } = req.body;

  try {
    
    const senderEmail = await userDetail.findOne({ email: friendEmail }).select('email name image');
    const reject = await userDetail.findOne({ email: email }).select('friendRequest');
    
    
    
    reject.friendRequest.remove({ name: senderEmail.name, email: senderEmail.email, image: senderEmail.image });

    await reject.save();

    return res.status(200).json(true);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

//-------------------------------Accept---Friend--Request---------------------------------------------------

router.post('/AcceptFriendRequest', async function (req, res) {
  const { friendEmail, email } = req.body;

  try {
    
    const senderEmail = await userDetail.findOne({ email: friendEmail })
    
    const accept = await userDetail.findOne({ email: email })

    if(accept.friend.some(friend => friend.email === friendEmail)){
      accept.friendRequest.remove({name:senderEmail.name,email:senderEmail.email,image:senderEmail.image})
      return res.send('already added')
    }
  
//---------------------Add-----sender-------------------------------------------------------------------------
    accept.friend.push({ name: senderEmail.name, email: senderEmail.email, image: senderEmail.image });
//--------------------Add---accept--user--to--sender---side-------------------------------------------------
    senderEmail.friend.push({name:accept.name, email:accept.email, image:accept.image})
//-----------remove----sender---------------------detail---------------------------------------------------
    accept.friendRequest = accept.friendRequest.filter(request => request.email !== senderEmail.email);


    await accept.save();
    await senderEmail.save()

    return res.status(200).json(true);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

//---------------------------------chatting--with--selected--User--Right--Room--------------------------------

router.post('/SelectedUser',async function (req,res){
  const {selectedUser} =req.body;
  try{
    const selecteduser = await userDetail.findOne({ email: selectedUser })

   
   return res.json(selecteduser)

  } catch (err) {
    
     return res.status(500).json({ error: "An error occurred " });
   }

})



module.exports = router;