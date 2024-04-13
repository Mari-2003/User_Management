// import packages
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

//import files
const db = require('./src/config/db');
const userRouter = require('./src/routes/userRouter')

const app = express();

// port number get in env file
const Port = process.env.PORT || 3002;

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(bodyParser.json());

//database connection 
db.once('open',()=> console.log("connected"));
db.on('error',(err)=>console.log("error"+err));


//API Router 
app.use('/api/v1',userRouter);

// server listening port 
app.listen(Port,()=>{
    console.log(`Server Started at ${Port}`)
})