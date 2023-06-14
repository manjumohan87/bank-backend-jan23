// import express

const express = require('express')


//import logMiddleware
const middleware = require('../middleware/routerSpecific')

//creates routes, using express.Router() class ,object

const router = new express.Router()

// import controller

const userController = require('../controllers/userController')

//define routes to resolve http request

// register rqst
router.post('/employee/register',userController.register)

//login

router.post('/employee/signin',userController.login)

//balance req   ':' path parameter icon
router.get(`/balance/:acno`,middleware.logMiddleware,userController.getbalance)


//balanfund transferce req   ':' path parameter icon
router.post(`/transfer`,middleware.logMiddleware,userController.fundtransfer)

//ministatement

router.get('/ministatement',middleware.logMiddleware,userController.getTransactions)


//delete Myaccount

router.delete('/remove',middleware.logMiddleware,userController.deleteMyAcno)

//export server
module.exports = router