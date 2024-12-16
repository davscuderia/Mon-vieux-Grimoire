const express = require('express')
const router = express.Router()

const stuffCtrl = require('../controllers/Stuff')
const User = require('../models/User')

router.get('/', stuffCtrl.getAllStuff)

router.get('/bestrating', stuffCtrl.bestRating)
router.post('/', stuffCtrl.createBook)
router.post('/:id/rating', stuffCtrl.rateBook)
router.get('/:id', stuffCtrl.getOneBook)
router.put('/:id', stuffCtrl.modifyBook)
router.delete('/:id', stuffCtrl.deleteBook)

router.get('/', (req, res, next) => {
    res.status(200).json({
    message: 'livre créé second test stuff !'
    })
})

module.exports = router