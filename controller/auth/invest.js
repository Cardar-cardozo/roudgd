const { validationResult } = require("express-validator");
const Invest = require("../../models/transaction");
const Wallet = require("../../models/wallet");
// const sendEmail = require('../email/sendEmail')
const User = require('../../models/adminUser');
const cloudinary = require('../../utils/cloudinary')

exports.allApps = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let history = "deposit";
    const { amount, PaymentMethod } =
      req.body;

    let userid = req.user.id;

    let invest = Invest({
      userid,
      history,
      amount, PaymentMethod,
    });

    let addinvest = await invest.save();
    return res
      .status(200)
      .json({ status: 200, addinvest, msg: " wait for permission" });

  } catch (err) {
    console.log(err.message);
    return res.status(500).send({ message: "server error", status: 500 });
  }
};

exports.withdraw = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let history = "withdrew";
    const { amount, sortNumber, accountNumber, accountName, PaymentMethod } =
      req.body;

    let userId = req.user.id;
    console.log(userId)
    let a = await Wallet.findOne({ userid: userId });

    if (amount > a.ACCOUNTBALANCE) {
      console.log(a.ACCOUNTBALANCE)
      return res
        .status(400)
        .json({ status: 400, msg: "No sufficoent money" });
    }

    let invest = Invest({
      userid: userId,
      sortNumber, accountNumber, accountName, 
      history,
      amount, PaymentMethod,
    });

    let addinvest = await invest.save();
    return res
      .status(200)
      .json({ status: 200, addinvest, msg: " wait for permission" });

  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "server error", status: 500 });
  }
};

exports.adminDepositAndWithdraw = async (req, res) => {
  let transactionStatus = req.params.transactionStatus

  let userId = req.query._id;
  try {
    if (transactionStatus === 'withdraw') {
      let Status = 'Approved'
      let PaymentMethod = 'transfer'

      let history = "withdrawal";
      const { amount } =
        req.body;

      let a = await Wallet.findOne({ userid: userId });

      if (amount > a.ACCOUNTBALANCE) {
        return res
          .status(400)
          .json({ status: 400, addinvest, msg: "No sufficoent money" });
      }

      totalacc = Number(a.ACCOUNTBALANCE) - Number(amount);

      let invest = Invest({
        userid: userId,
        history, Status,
        amount, PaymentMethod,
      });

      let addinvest = await invest.save();
      // const update = {
      //   $inc: {
      //     slotInUse: 1,
      //     availableSlot: -1,
      //   },
      // };
      const updateAccount = {
        $set: { ACCOUNTBALANCE: totalacc },
        $inc: {
          WITHDRAWAL: 1,
          TRANSACTION: 1,
        },
      };
      let updateWallet = await Wallet.findOneAndUpdate(
        { userid: userId },
        updateAccount,

        { new: true }
      );

      if (updateWallet) {
        //   sendEmail(user.email,message, reason, (data) => {
        //     if (data) {
        //     return   res.status(200).json({
        //           status:200,
        //           email: user.email,
        //           msg: 'email sent'
        //        })
        //     } 

        //  });
        return res
          .status(200)
          .json({ status: 200, updateWallet, msg: "successfull" });
      }
    } else if (transactionStatus === 'deposit') {
      let Status = 'Approved'
      let PaymentMethod = 'transfer'

      let history = "deposit";
      const { amount } =
        req.body;

      let a = await Wallet.findOne({ userid: userId });
      console.log(a)

      if (amount < 1000) {
        return res
          .status(400)
          .json({ status: 400, msg: "deposit must be between 1000 and 200,000" });
      }

      totalacc = Number(a.ACCOUNTBALANCE) + Number(amount);

      let invest = Invest({
        userid: userId,
        history, Status,
        amount, PaymentMethod,
      });

      let addinvest = await invest.save();
      const updateAccount = {
        $set: { ACCOUNTBALANCE: totalacc },
        $inc: {
          DEPOSIT: 1,
          TRANSACTION: 1,
        },
      };
      let updateWallet = await Wallet.findOneAndUpdate(
        { userid: userId },
        updateAccount,

        { new: true }
      );

      if (updateWallet) {
        //   sendEmail(user.email,message, reason, (data) => {
        //     if (data) {
        //     return   res.status(200).json({
        //           status:200,
        //           email: user.email,
        //           msg: 'email sent'
        //        })
        //     } 

        //  });
        return res
          .status(200)
          .json({ status: 200, updateWallet, msg: "successfull" });
      }
    }

  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "server error", status: 500 });
  }
};


exports.adminApprove = async (req, res) => {

  try {
    let transactionStatus = req.params.transactionStatus

    let investId = req.query._id;
    let status = 'Approved'
    if (transactionStatus === '') {
      return
    }
    if (transactionStatus === 'adminApproveDeposit') {

      console.log(status)

      console.log(investId)
      if (status === '') {
        return
      }

      const update = {
        $set: { Status: status },
      };
      let getInvest = await Invest.findOneAndUpdate(
        { _id: investId },
        update,

        { new: true }
      );

      let userId = getInvest.userid;

      if (getInvest) {
        let a = await Wallet.findOne({ userid: userId });
        let user = await User.findOne({ _id: userId })
        let pendngacc;
        let totalacc;
        let message;
        let reason;
        if (status === "Approved") {
          console.log(a.ACCOUNTBALANCE)
          totalacc = Number(a.ACCOUNTBALANCE) + Number(getInvest.amount);
          message = "Your Payment has been approved";
          reason = "Investment aprroved";
        }

        if (status === "Cancel") {

          if (a.PendingACCOUNTBALANCE === 0) {
            totalacc = a.ACCOUNTBALANCE
          } else {

            totalacc = a.ACCOUNTBALANCE
          }

          message = "Dont know for now";
          reason = "Payment Decline";
        }


        const updateAccount = {
          $set: {  ACCOUNTBALANCE: totalacc },
          $inc: {
            DEPOSIT: 1,
            TRANSACTION: 1,
          },
        };
        let updateWallet = await Wallet.findOneAndUpdate(
          { userid: userId },
          updateAccount,

          { new: true }
        );

        if (updateWallet) {
          //   sendEmail(user.email,message, reason, (data) => {
          //     if (data) {
          //     return   res.status(200).json({
          //           status:200,
          //           email: user.email,
          //           msg: 'email sent'
          //        })
          //     } 

          //  });
          return res
            .status(200)
            .json({ status: 200, updateWallet, msg: "approved" });
        }
      }
    } else if (transactionStatus === 'adminApproveWithdraw') {
      console.log(status)

      console.log(investId)
      if (status === '') {
        return
      }

      const update = {
        $set: { Status: status },
      };
      let getInvest = await Invest.findOneAndUpdate(
        { _id: investId },
        update,

        { new: true }
      );

      let userId = getInvest.userid;

      if (getInvest) {
        let a = await Wallet.findOne({ userid: userId });
        let user = await User.findOne({ _id: userId })
        let pendngacc;
        let totalacc;
        let message;
        let reason;
        if (status === "Approved") {
          totalacc = Number(a.ACCOUNTBALANCE) - Number(getInvest.amount);
          message = "Your Payment has been approved";
          reason = "Investment aprroved";
        }

        if (status === "Cancel") {


          totalacc = a.ACCOUNTBALANCE


          message = "Dont know for now";
          reason = "Payment Decline";
        }


        const updateAccount = {
          $set: { ACCOUNTBALANCE: totalacc },
          $inc: {
            WITHDRAWAL: 1,
            TRANSACTION: 1,
          },
        };
        let updateWallet = await Wallet.findOneAndUpdate(
          { userid: userId },
          updateAccount,

          { new: true }
        );

        if (updateWallet) {
          //   sendEmail(user.email,message, reason, (data) => {
          //     if (data) {
          //     return   res.status(200).json({
          //           status:200,
          //           email: user.email,
          //           msg: 'email sent'
          //        })
          //     } 

          //  });
          return res
            .status(200)
            .json({ status: 200, updateWallet, msg: "approved" });
        }
      }
    }

  } catch (err) {
    console.log(err.message);
    return res.status(500).send({ message: "server error", status: 500 });
  }

};

exports.gethistory = async (req, res) => {
  const { page, limit } = req.query
  try {
   





    let pagination = await Invest.find()

    let transaction = await Invest.find().sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .exec();

    let total = pagination.length

    if (transaction) {
      return res
        .status(200)
        .json({ status: 200, transaction, total, msg: "Got pays" });
    }
  } catch (err) {
    console.log(err.message);
    return res.status(500).send({ message: "server error", status: 500 });
  }
};


exports.getTrans = async (req, res) => {
  const { page, limit } = req.query
  try {



let userId = req.user.id;


    let pagination = await Invest.find({ userid: userId })

    let transaction = await Invest.find({ userid: userId }).sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .exec();

    let total = pagination.length

    if (transaction) {
      return res
        .status(200)
        .json({ status: 200, transaction, total, msg: "Got transactions" });
    }
  } catch (err) {
    console.log(err.message);
    return res.status(500).send({ message: "server error", status: 500 });
  }
};

