const express = require('express')
const app = express()
const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://Dav-Admin:Eyqki1wyMl5xzzLm@cluster0.dikgl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    { useNewUrlParser: true,
      useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const Book = require('./models/Book')
const User = require('./models/User')

app.use(express.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    next()
})

app.get('/api/books', (req, res, next) => {
    res.status(200).json({
    message: 'livre créé !'
    })
})

module.exports = app