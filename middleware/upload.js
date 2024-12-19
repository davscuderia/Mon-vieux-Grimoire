const multer = require('multer')
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')
const { storage } = require('../middleware/multer-config')
const upload = require('../middleware/multer-config')

const optimizeImage = (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Aucun fichier trouvé.' })
    }
    if (!req.file.filename) {
        return res.status(400).json({ message: 'nom de fichier manquant'})
    }
    console.log(req.file)
    const tempPath = req.file.path
    const outputPath = `images/temp_${Date.now()}.webp`
   
    sharp(tempPath)
        .webp({ quality: 80 })
        .toFile(outputPath)
        .then(() => {
            //pour supprimer le fichier temporaire
            fs.unlink(tempPath, (err) => {
                if (err) console.error('Erreur de suppression fichier :', err)
            })
            req.file.path = outputPath
            req.file.filename = outputPath.split('/').pop() //maj du nom de fichier
            next()
        })
        .catch((error) => {
            console.error('erreur lors de la conversion du fichier', error)
            res.status(500).json({ message: 'Erreur lors de l\'optimisation de l\'image'})
        })
}

module.exports = { upload, optimizeImage }