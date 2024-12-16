const express = require('express')
const mongoose = require('mongoose')
const stuffRoutes = require('./routes/Stuff')

const app = express()


//connection à Mongodb
mongoose.connect('mongodb+srv://Dav-Admin:Eyqki1wyMl5xzzLm@cluster0.dikgl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    { useNewUrlParser: true,
      useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'))

app.use(express.json())

//middleware pour gérer le CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    next()
})

app.use('/api/books', stuffRoutes)

module.exports = app