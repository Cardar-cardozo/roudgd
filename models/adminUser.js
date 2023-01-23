const mongoose = require('mongoose')

const Schema = mongoose.Schema

const AdminUserSchema = Schema({
    userName: {
        type: String,
        required: true,
        unique: true,

    },

    firstName: {
        type: String,
        required: true,
    },

    lastName: {
        type: String,
        required: true,
    },

    country: {
        type: String,
        required: true,
    },

    mobile: {
        type: String,
        required: true,
    },

    city: {
        type: String,
        required: true,
    },

    zipCode: {
        type: Number,
        required: true,
    },

    address : {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    referalPoint:{
        type:Number,
        default:0
    },

    password: {
        type: String,
        required: true,
    },
    userType:{
        type:String,
        enum:['User', 'Admin']
    },

    status:{
        type:String,
        default:'notVerified',
        enum:['verified', 'notVerified']
    },

    kycStatus:{
        type:String,
        default:'notVerified',
        enum:['verified', 'notVerified']
    }

},
    { timestamps: true })


module.exports = mongoose.model('AdminUser', AdminUserSchema)