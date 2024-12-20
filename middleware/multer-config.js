const multer = require('multer')
const fs = require('fs')
const path = require('path')

const imagesFolder = path.join(__dirname, '../images')

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp'
}


const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const uploadFolder = `${imagesFolder}/temp`
        if (!fs.existsSync(uploadFolder)) {
            fs.mkdirSync(uploadFolder, { recursive: true })
        }
       callback(null, uploadFolder) 
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_').replace(/\.[^/.]+$/, '')
        const extension = MIME_TYPES[file.mimetype]
        if (!extension) {
            return callback(new Error('Type de fichier non supporté'))
        }
        callback(null, `${name}_${Date.now()}.${extension}`)
    }
})

module.exports = multer({ storage }).single('image')