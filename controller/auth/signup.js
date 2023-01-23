const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../../models/adminUser');
const wallet = require('../../models/wallet')
const date = require('date-and-time');
const jwt = require('jsonwebtoken');
require('dotenv').config()
// const sendEmail = require('../email/sendEmail')

exports.registerAdminUser = async (req, res) => {
    //Request validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
    }
    const { userName, firstName, lastName, country, mobile, city, zipCode, address,   email, password, userType } = req.body;
    const referalUserName = req.query.username
    console.log(req.body)
 
    try {
       //Check if user exists
       let user = await User.findOne({ email:email, firstName:firstName });
       if (user) {
          return res.status(400).json({status:400,  msg: 'email or username already in use' })
       }
 
         let kycStatus = 'notVerified'
        
       //Creating new user
       user = new User({
        userName, firstName, lastName, country, mobile, city, zipCode, address, kycStatus,  email, password, userType
       })
            
       

       //Password encryption
       const salt = bcrypt.genSaltSync(10);
       user.password = bcrypt.hashSync(password, salt);


       function randomNumber(length) {
        var text = "";
        var possible = "123456789";
        for (var i = 0; i < length; i++) {
          var sup = Math.floor(Math.random() * possible.length);
          text += i > 0 && sup == i ? "0" : possible.charAt(sup);
        }
        return Number(text);
      }
    
    
       
       
       //Save to DB
       let AdminUserDetails = await user.save();

        let a = AdminUserDetails._id
        let userid = a.toString()
        console.log(a.toString())

        let AccountNumber = '95' + randomNumber(10)

       wal = new wallet({
         userid,
         ACCOUNTNUMBER:AccountNumber
       })

       if (userType === "User") {
          
          let c = await wal.save()
          console.log(c)
       }

       const message = 'Congratulations, you are welcome on'

       const reason = 'Account created'

       if (AdminUserDetails) {
      //   sendEmail(AdminUserDetails.email,message, reason, (data) => {
      //       if (data) {
      //       return   res.status(200).json({
      //             status:200,
      //             email: user.email,
      //             msg: 'email sent'
      //          })
      //       } 
            
      //    });

         let userRef = await User.findOne({  firstName:referalUserName });
         if (!userRef) {
            return res.status(200).json({status:200,  msg: 'referal user not found but account was created successfully', userId:AdminUserDetails._id, })
         }

         const update = {
            $inc: {
               referalPoint: 1,
            },
        };

        const updatedProduct = await User.findOneAndUpdate(
            {_id: userRef._id},
            update,
            {
                new: true,
            }
        );
           
        return res.status(200).json({status:200, userId:AdminUserDetails._id, msg:"admin creation successfull"})

       }
 

 
    } catch (err) {
       console.log(err.message)
      return res.status(500).send({message:'server error', status:500});
    }
 }
