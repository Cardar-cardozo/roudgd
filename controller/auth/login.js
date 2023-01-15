const { validationResult } = require('express-validator');
const AdminUser = require('../../models/adminUser')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
// const AdminNotification = require('../../models/notification')
require('dotenv').config()



exports.authenticateAdminUser = async (req, res) => {
    //Request validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    try {
        //Check if email exists
        let user = await AdminUser.findOne({ email })
        if (!user) {
            return res.status(400).json({status:400, msg: 'invalid credentials' });
        }

        //Check if password match
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({status:400, msg: 'invalid credentials' });
        }

        //JWT payload
        const payload = {
            user: {
                id: user.id
            }
        }


        //Keep Login seesion in notification
        // let notify = await new AdminNotification({
        //     user: user.id,
        //     type: 'Login Session',
        //     body: `You just logged in to your account`,
        //     userAgent: { source: req.useragent.source }
        // })

        // if (req.useragent.isMobile) notify.userAgent.device = 'Mobile Phone'
        // if (req.useragent.isDesktop) notify.userAgent.device = 'Desktop'


        // notify.save();

        // //Push into user notification array
        // user.notification.push(notify._id)
        // user.save();


        //Generate Token
        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: 3600000
        }, (err, token) => {
            if (err) throw err;
         return res.status(200).json({status:200, userId:user._id, data:token, message:'Login successfull' });
        });


    } catch (error) {
     return   res.status(500).send(error.message);
    }
}




// exports.getLoggedInUser = async (req, res) => {
//     //Get user details
//     try {
//         const user = await AdminUser.findById(req.user.id).populate(
//             [
//                 {
//                     path: 'notification',
//                     model: 'Notification',
//                     options: {
//                         sort: { createdAt: -1 }
//                     }
//                 },

//                 {
//                     path: 'charges',
//                     model: 'Charges'
//                 }

//             ]).select('-password -date');
//         res.json(user);
//     } catch (err) {
//         res.status(500).send('server error');
//     }
// }
// kkkjkjj