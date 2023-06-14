// import 
//config :Loads .env file contents into process.env.
require('dotenv').config();

//import express
const express = require('express');

// import cors
const cors = require('cors')

//import db
require('./db/connection')

//import router
const router = require('./routes/router')

//import appMiddleware

const middleware = require('./middleware/appMiddleware')



//create  express server
const server = express()

//setup port number for server
const PORT = 3000 || process.env.PORT

//use cors, json parser in server app
server.use(cors())
server.use(express.json()) // parser

//use appMiddleware
server.use(middleware.appMiddleware)

// use router  in server app
server.use(router)

//to resolve http request using express server

server.get('/',(req,res)=>{
    res.send("<h3>Bank server started</h3")
})


//run the server app in specified port
server.listen(PORT,()=>{
    console.log(`Bank Server Started at port number ${PORT}`);
})