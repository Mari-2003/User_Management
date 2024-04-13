
const mongoose = require('mongoose')
require('dotenv').config();

const mongooseConnection = process.env.db_Connection_String

mongoose.connect(mongooseConnection,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
})

const db = mongoose.connection


module.exports = db