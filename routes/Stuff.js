const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')
const User = require('../models/User')
const stuffCtrl = require('../controllers/Stuff')


router.get('/', auth, stuffCtrl.getAllStuff)
router.get('/bestrating', auth, stuffCtrl.bestRating)
router.post('/', auth, multer, stuffCtrl.createBook)
router.post('/:id/rating', auth, multer, stuffCtrl.rateBook)
router.get('/:id', auth, stuffCtrl.getOneBook)
router.put('/:id', auth, multer, stuffCtrl.modifyBook)
router.delete('/:id', auth, stuffCtrl.deleteBook)


module.exports = router