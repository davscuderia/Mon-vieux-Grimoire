const express = require('express')
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')
const router = express.Router()

const stuffCtrl = require('../controllers/Stuff')
const User = require('../models/User')

router.get('/', auth, stuffCtrl.getAllStuff)
router.get('/bestrating', auth, stuffCtrl.bestRating)
router.post('/', auth, stuffCtrl.createBook)
router.post('/:id/rating', auth, stuffCtrl.rateBook)
router.get('/:id', auth, stuffCtrl.getOneBook)
router.put('/:id', auth,  stuffCtrl.modifyBook)
router.delete('/:id', auth, stuffCtrl.deleteBook)

router.get('/', (req, res, next) => {
    res.status(200).json({
    message: 'livre créé second test stuff !'
    })
})

module.exports = router