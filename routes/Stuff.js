const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')
const { optimizeImage } = require('../middleware/upload')

const User = require('../models/User')
const stuffCtrl = require('../controllers/Stuff')


router.get('/', stuffCtrl.getAllStuff)
router.get('/bestrating', stuffCtrl.bestRating)
router.post('/', auth, multer, optimizeImage, stuffCtrl.createBook)
router.post('/:id/rating', auth, stuffCtrl.rateBook)
router.get('/:id', stuffCtrl.getOneBook)
router.put('/:id', auth, multer, optimizeImage, stuffCtrl.modifyBook)
router.delete('/:id', auth, stuffCtrl.deleteBook)


module.exports = router