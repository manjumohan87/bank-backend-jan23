//import model in useController.js file

const { json } = require('express');
const users = require('../models/userSchema')


//import jsonwen=btoken

const jwt = require('jsonwebtoken')

//define and export logic  to resolve different http client request

//register
exports.register = async (req, res) => {

    console.log(req.body);

    //get data send by front end
    const { username, acno, password } = req.body // destructuring method

    if (!username || !acno || !password) {
        res.status(403).json("All Inpiuts are required !!!")

    }
    // check user is an exist user

    try {
        const preuser = await users.findOne({ acno })
        // console.log(response);
        // res.json("register request recievd")

        if (preuser) {
            res.status(406).json("User already exist")
        }
        else {
            //add user to db

            const newuser = new users({
                username,
                password,
                acno,
                balance: 5000,
                transactions: []
            })
            //to save newuser in mongodb

            await newuser.save()
            res.status(200).json(newuser)

        }
    }
    catch (error) {
        res.status(401).json(error)
    }

}


//login

exports.login = async (req, res) => {
    //get request body

    const { acno, password } = req.body

    try {
        //check acno and password in db
        const preuser = await users.findOne({ acno, password })
        //check presuer or not
        if (preuser) {
            //generate token using jwt
            const token = jwt.sign({ loginAcno: acno }, "supersecretkey12345")

            //send to client
            res.status(200).json({ preuser, token })
        }
        else {
            res.status(404).json("Invalid account number / password")
        }

    }
    catch (error) {
        res.status(401).json(error)
    }

}

//get balance

exports.getbalance = async (req, res) => {
    // get acno from path parameter
    let acno = req.params.acno

    // get data of give acno
    try {
        const preuser = await users.findOne({ acno })
        res.status(200).json(preuser.balance)

    }
    catch (error) {
        res.status(404).json("Invalid Account Number")


    }
}

//fund transfer

exports.fundtransfer = async (req, res) => {
    console.log("Inside  Transfer Logic");
    //logic

    //1.get body  from req, creditacno,amt,pswd

    const { creditAcno, creditAmount, pswd } = req.body
    //convert crediamount to number
    let amt = Number(creditAmount)

    const { debitAcno } = req
    console.log(debitAcno);

    try {
        //2.check debit acno and pswd is available in mongodB
        const debitUserDetails = await users.findOne({ acno: debitAcno, password: pswd })
        console.log(debitUserDetails);

        //3.get credit accont details from mongodb
        const creditUserDetails = await users.findOne({ acno: creditAcno })
        console.log(creditUserDetails);

        if (creditAcno != debitAcno) {

            if (debitUserDetails && creditUserDetails) {
                //check sufficient balance available for creditUserDetails
                if (debitUserDetails.balance >= creditAmount) {
                    //perform transfer
                    //debit creditamount from debitUserDetails
                    debitUserDetails.balance -= amt
                    //add debit transctions to debitUserDetails
                    debitUserDetails.transactions.push({
                        transaction_type: "DEBIT", amount: creditAmount, fromAcno: debitAcno, toAcno: creditAcno
                    })
                    //save debitUserDetails in mongo db
                    debitUserDetails.save()

                    //credit creditamount to creditUswerdetails

                    creditUserDetails.balance += amt
                    //add credit transctions to creditUserDetails
                    creditUserDetails.transactions.push({
                        transaction_type: "CREDIT", amount: creditAmount, fromAcno: debitAcno, toAcno: creditAcno
                    })

                    //save creditUserDetails in mongodb

                    creditUserDetails.save()
                    res.status(200).json("Fund Transfer Successfully Completed")

                }
                else {
                    res.status(406).json("Insufficient Balance")
                }

            }
            else {
                res.status(406).json("Invalid credit / debit details")
            }
        }
        else {
            res.status(406).json("Operation denied!!! Self transaction not Allowed")
        }



    }
    catch (error) {
        res.status(406).json(error)
    }






}


//getTransctions

exports.getTransactions = async (req, res) => {
    //1.get acno from req.debitAcno
    let acno = req.debitAcno

    //2.checkong acno is available in mongo db

    try {
        const preuser = await users.findOne({ acno })
        res.status(200).json(preuser.transactions)
    }
    catch (error) {
        res.status(401).json(error)
    }
}

//deleteMyAccount

exports.deleteMyAcno = async (req,res)=>{
    //1. get acno from db

    let acno = req.debitAcno

    //remove acno from db

    try{
        await users.deleteOne({acno})
        res.status(200).json("Removed Successfully")
    }
    catch(error){
        res.status(401).json(error)
    }
}