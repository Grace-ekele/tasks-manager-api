const mongoose = require('mongoose')


const uri = process.env.DATABASE_URL


const dataBase = mongoose.connect(uri)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));




module.exports =dataBase



