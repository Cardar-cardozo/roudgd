const wallet = require('../../models/wallet')
const Kyc = require("../../models/kyc");
const User = require('../../models/adminUser');
const { validationResult } = require("express-validator");


exports.allApps = async (req, res) => {
    try {
        //Fetch all apps that belongs user
        console.log(req.user.id)
        let users = await User.findOne({ _id: req.user.id });
        const apps = await wallet.findOne({ userid: req.user.id })  .sort({ createdAt: -1 })
            .exec()
        res.json([apps, users]);
    } catch (err) {
        res.status(500).send({message:'server error', status:500});
    }
}

exports.kyc = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    try {
      const { address, fullname, fathername, mothername, secure_url, public_id} =
        req.body;
  
      let userid = req.user.id;
  
      let kyc = Kyc({
        userid,
        address, fullname, fathername, mothername,
        secure_url, public_id
      });
  
      let addKyc = await kyc.save();
      const updateAccount = {
        $set: { kycStatus: 'verified' },
      };
      let updateWallet = await User.findOneAndUpdate(
        { userid: userid },
        updateAccount,

        { new: true }
      );
      return res
        .status(200)
        .json({ status: 200, addKyc,updateWallet,  msg: " wait for permission" });
  
    } catch (err) {
      console.log(err.message);
      return res.status(500).send({ message: "server error", status: 500 });
    }
  };

exports.getKyc = async (req, res) => {
    let userId = req.params._id;
    try {
        //Fetch all apps that belongs user
        const apps = await Kyc.findOne({ userid: userId });
    res.json(apps)
    } catch (err) {
        console.log(err)
        res.status(500).send({message:'server error', status:500});
    }
}