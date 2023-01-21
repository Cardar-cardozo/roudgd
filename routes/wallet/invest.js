const express = require("express");
const authMiddleware = require("../../middlewares/auth");
const upload = require("../../middlewares/multer");
const { check } = require("express-validator");

const router = express.Router();

const a = require("../../controller/auth/invest");

router.post(
    "/invest",
    // [
    //   check("investmentplan")
    //     .exists()
    //     .withMessage("Plan is Requiered")
    //     .isString()
    //     .withMessage("A plan is required"),
    //   check("AmountInvested")
    //     .isNumeric()
    //     .isLength({
    //       min: 3,
    //     })
    //     .withMessage("Max of 10 characters required")
    //     .trim()
    //     .not()
    //     .isEmpty()
    //     .withMessage("Amount is required required"),
    //   check("PaymentMethod")
    //     .exists()
    //     .withMessage("PaymentMethod is Requiered")
    //     .isString()
    //     .withMessage("PaymentMethod is required"),
    //   check("PaymentAddress")
    //     .trim()
    //     .escape()
    //     .not()
    //     .isEmpty()
    //     .withMessage("PaymentAddress required"),
    // ],
    authMiddleware,
    a.allApps
);

router.get("/getDeposit", authMiddleware, a.getTrans);

router.get("/getTrans", a.gethistory);

router.post("/withdraw", 
    [
    check("amount")
        .isNumeric()
        .isLength({
          min: 2,
        })
        .withMessage("length is 2"),
       check("PaymentMethod")
        .exists()
        .withMessage("PaymentMethod is Requiered")
        .isString()
        .withMessage("PaymentMethod is required"),   
    ], 
    authMiddleware, a.withdraw);

    router.patch("/approve/:transactionStatus", a.adminApprove);

router.put("/adminwithdrawordeposit/:transactionStatus", a.adminDepositAndWithdraw);

module.exports = router;
