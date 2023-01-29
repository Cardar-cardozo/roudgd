const express = require("express");
const authMiddleware = require("../../middlewares/auth");
const { check } = require("express-validator");

//Importing express router
const router = express.Router();

const signupController = require("../../controller/auth/signup");

router.post(
    "/signup",
    [
        //Validation rules
        check("userName")
            .trim()
            .escape()
            .not()
            .isEmpty()
            .withMessage("username required")
            .isLength({
                min: 3,
            })
            .withMessage("username is min of 3 characters required"),
        check("firstName")
            .trim()
            .escape()
            .not()
            .isEmpty()
            .withMessage("First Name required")
            .isLength({
                min: 3,
            })
            .withMessage("First Name is min of 3 characters required"),
        check("lastName")
            .trim()
            .escape()
            .not()
            .isEmpty()
            .withMessage("last Name required")
            .isLength({
                min: 3,
            })
            .withMessage("last Name is min of 6 characters required"),
        check("country")
            .trim()
            .escape()
            .not()
            .isEmpty()
            .withMessage("country required")
            .isLength({
                min: 3,
            })
            .withMessage("country is min of 3 characters required"),
        check("mobile")
            .trim()
            .escape()
            .not()
            .isEmpty()
            .withMessage("mobile required")
            .isLength({
                max: 13
            })
            .withMessage("mobile is max of 13 characters required"),
        check("city")
            .trim()
            .escape()
            .not()
            .isEmpty()
            .withMessage("city required")
            .isLength({
                min: 3,
            })
            .withMessage("city is min of 3 characters required"),
        check("zipCode")
            .trim()
            .escape()
            .not()
            .isEmpty()
            .withMessage("postal required")
            .isLength({
                min: 3,
            })
            .withMessage("postal is min of 3 characters required"),
        check("address")
            .trim()
            .escape()
            .not()
            .isEmpty()
            .withMessage("address required")
            .isLength({
                min: 3,
            })
            .withMessage("address is min of 3 characters required"),
        check("email")
            .trim()
            .not()
            .isEmpty()
            .withMessage("Email Address required")
            .isEmail()
            .normalizeEmail()
            .withMessage("Must be a valid email"),
        check("password")
            .not()
            .isEmpty()
            .withMessage("Password required")
            .isLength({ min: 5 })
            .withMessage("password must be minimum 5 length")
            .matches(/(?=.*?[A-Z])/)
            .withMessage("password must have at least one Uppercase")
            .matches(/(?=.*?[a-z])/)
            .withMessage("password must have at least one Lowercase")
            .matches(/(?=.*?[0-9])/)
            .withMessage("password must have at least one Number")
            .matches(/(?=.*?[#?!@$%^&*-])/)
            .withMessage("password must have at least one special character")
            .not()
            .matches(/^$|\s+/)
            .withMessage("password must not have White space not allowed"),
        check("userType")
            .exists()
            .withMessage("userType is Requiered")
            .isString()
            .withMessage("A userType is required")
            .isIn([
                'User', 'Admin'
            ])
            .withMessage("userType does contain invalid value"),
    ],
    signupController.registerAdminUser
);

// router.get('/getusers', authMiddleware, signupController.getUsers)

// router.post('/sendmails/:_id',  signupController.sendGmails)




module.exports = router;
