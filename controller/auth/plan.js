const { validationResult } = require("express-validator");
// const Plan = require("../../models/plan");
// const Pay = require("../../models/payment");
const Invest = require("../../models/transaction");
const User = require("../../models/adminUser");
const cloudinary = require('../../utils/cloudinary')
const Wallet = require("../../models/wallet");

exports.getUsers = async (req, res) => {
    const { page, limit } = req.query;
  
    try {
      let a  = await User.find({ userType: "User" })
      let users = await User.find({ userType: "User" })
        .sort({ createdAt: -1 })
        .skip((parseInt(page) - 1) * parseInt(limit))
        .limit(parseInt(limit))
        .exec();
       let total = a.length 
  
      if (users) {
        return res.status(200).json({ status: 200, total, users, msg: "Got users" });
      }
    } catch (err) {
      console.log(err.message);
      return res.status(500).send({ message: "server error", status: 500 });
    }
  };
  
  exports.getUsersById = async (req, res) => {
    let userId = req.params._id;
  
    try {
      let users = await User.findOne({ _id: userId });
  
      let tran = await Invest.find({userid:userId})
  
      let trans = tran.length
  
    
      let wallet = await Wallet.find({userid:userId})
  
      if (users) {
        return res.status(200).json({ status: 200, trans, wallet,  users, msg: "Got plans" });
      }
    } catch (err) {
      console.log(err.message);
      return res.status(500).send({ message: "server error", status: 500 });
    }
  };
  
  exports.getTransById = async (req, res) => {
    let userId = req.params._id;
    const { page, limit } = req.query;
    try {
      let trans = await Invest.find({ userid: userId })
        .sort({ createdAt: -1 })
        .skip((parseInt(page) - 1) * parseInt(limit))
        .limit(parseInt(limit))
        .exec();
  
      if (trans) {
        return res.status(200).json({ status: 200, trans, msg: "Got plans" });
      }
    } catch (err) {
      console.log(err.message);
      return res.status(500).send({ message: "server error", status: 500 });
    }
  };
  
  exports.getTransByStatus = async (req, res) => {
    let status = req.params.status;
    console.log(status);
    const { page, limit } = req.query;
    try {
      let trans = await Invest.find({ Status: status })
        .sort({ createdAt: -1 })
        .skip((parseInt(page) - 1) * parseInt(limit))
        .limit(parseInt(limit))
        .exec();
  
      if (trans) {
        return res.status(200).json({ status: 200, trans, msg: "Got plans" });
      }
    } catch (err) {
      console.log(err.message);
      return res.status(500).send({ message: "server error", status: 500 });
    }
  };
  
  exports.addProductImage = async (req, res) => {
    //Send image upload error
    // if (req.fileValidationError)
    //   return res.status(401).json({ status: 401, msg: req.fileValidationError });
  
    console.log(req.file)
    const { path } = req.file;
  
    try {
      //Upload product image to cloudinary
      let result = await cloudinary.uploader.upload(path);
  
  
      res.status(200).json({ status: 200, result, msg: "image added" });
    } catch (error) {
      res.status(500).send({ message: "server error", status: 500 });
    }
  };