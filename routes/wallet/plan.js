const express = require("express");
const authMiddleware = require("../../middlewares/auth");
const { check } = require("express-validator");
const upload = require('../../middlewares/multer')

const router = express.Router();

const a = require("../../controller/auth/plan");



router.get('/getUser',  a.getUsers)

router.get('/getUsersById/:_id',  a.getUsersById)

router.get('/getTransById/:_id',  a.getTransById)



router.post('/addProductImage',  upload.single('productImage'), a.addProductImage)

router.get('/getTransByStatus/:status',  a.getTransByStatus)

module.exports = router;