const express = require('express')

const app = express()

app.use((req, res, next) => {
    console.log('requete reçue !')
    next()
})

app.use((req, res, next) => {
    res.status(201)
    next()
})

app.use((req, res, next) => {
    res.json({ message: 'test réponse reçue !'})
})

module.exports = app