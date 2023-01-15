const jwt = require('jsonwebtoken');
require('dotenv').config()
const User = require('../models/adminUser')

module.exports = async (req, res, next) => {
    //Get Token fron header
    const token = req.header('x-auth-token');

    //Check if token
    if (!token) {
        return res.status(401).json({ msg: 'unauthorized' });
    }

    //Decode token if valid
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;

        //Check if verified
        // let checkIfverified = await User.findOne({ _id: req.user.id, verification: true })
        // if (!checkIfverified) {
        //     return res.status(401).json({ msg: 'not verified' })
        // }

        next();

    } catch (error) {
        res.status(401).json({ msg: error.message });

    }

}