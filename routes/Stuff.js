const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const { upload, optimizeImage } = require('../middleware/upload')
const multer = require('../middleware/multer-config')
//const User = require('../models/User')
const stuffCtrl = require('../controllers/Stuff')


router.get('/', stuffCtrl.getAllStuff)
router.get('/bestrating', stuffCtrl.bestRating)
router.post('/', auth, upload, optimizeImage, stuffCtrl.createBook)
router.post('/:id/rating', auth, stuffCtrl.rateBook)
router.get('/:id', stuffCtrl.getOneBook)
router.put('/:id', auth, upload, optimizeImage, stuffCtrl.modifyBook)
router.delete('/:id', auth, stuffCtrl.deleteBook)


module.exports = router