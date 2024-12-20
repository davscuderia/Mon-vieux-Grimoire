const sharp = require('sharp')
const fs = require('fs')
const path = require('path')


const optimizeImage = (req, res, next) => {
    console.log('fichier reçu par multer', req.file)
    
    if (!req.file) {
        console.log('aucun fichier à optimiser')
        return next()
    }

    const tempPath = req.file.path
    const outputPath = path.join('images', `optimized_${Date.now()}.webp`)
   
    sharp(tempPath)
        .webp({ quality: 80 })
        .toFile(outputPath)
        .then(() => {
            //pour supprimer le fichier temporaire
            fs.unlink(tempPath, (err) => {
                if (err) console.error('Erreur de suppression fichier :', err)
            })
            req.file.path = outputPath
            req.file.filename = path.basename(outputPath)
            console.log('optimisation réussie, nouveau fichier :', req.file)
            next()
        })
        .catch((error) => {
            console.error('erreur lors de la conversion du fichier', error)
            res.status(500).json({ message: 'Erreur lors de l\'optimisation de l\'image'})
        })
}

module.exports = { optimizeImage }