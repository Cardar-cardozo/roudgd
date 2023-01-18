const express = require('express')
const authMiddleware = require('../../middlewares/auth')
const { check } = require('express-validator');


const router = express.Router();



//Import controller
const appDetailsController = require('../../controller/auth/datainfo')

router.get('/details', authMiddleware, appDetailsController.allApps)

router.post("/kyc",
    [
        check("address")
        .exists()
        .withMessage("address is Requiered")
        .isString()
        .withMessage("address is string"),
        check("fullname")
            .exists()
            .withMessage("fullname is Requiered")
            .isString()
            .withMessage("fullname is string"),
        check("fathername")
            .exists()
            .withMessage("fathername is Requiered")
            .isString()
            .withMessage("fathername is string"),
        check("mothername")
            .exists()
            .withMessage("mothername is Requiered")
            .isString()
            .withMessage("mothername is string"),
        check("secure_url")
            .exists()
            .withMessage("secure_url is Requiered")
            .isString()
            .withMessage("secure_url is string"),
        check("public_id")
            .exists()
            .withMessage("public_id is Requiered")
            .isString()
            .withMessage("public_id is string"),
    ],
    authMiddleware, appDetailsController.kyc);

 router.get('/getKycId/:_id',  appDetailsController.getKyc)

// router.get('/admin', authMiddleware,  appDetailsController.getdetails)


module.exports = router;