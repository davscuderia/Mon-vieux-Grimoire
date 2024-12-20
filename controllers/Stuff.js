const Book = require('../models/Book')
const fs = require('fs')

exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book)
    delete bookObject._id
    delete bookObject._userId
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/${req.file.path}`
    })
    book.save()
    .then(() => { res.status(201).json({ message: 'Livre enregistré !' })})
    .catch(error => { res.status(400).json({ error })})
}

exports.getAllStuff = (req, res, next) => {
    Book.find().then(
      (books) => {
        res.status(200).json(books)
      })
      .catch(
        (error) => {
            res.status(400).json({
            error: error
            })
        }
    )
}

exports.bestRating = (req, res, next) => {
    Book.find()
        .sort({ averageRating: -1 }) // note moyenne décroissante
        .limit(3)
        .then((books) => {
            res.status(200).json(books)
        })
        .catch((error) => {
            res.status(500).json({ error })
        })
}

exports.getOneBook = (req, res, next) => {
    Book.findOne({
      _id: req.params.id
    })
    .then((book) => {
        res.status(200).json(book);
    })
    .catch((error) => {
        res.status(404).json({
          error: error
        });
    })
}

exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  
    delete bookObject._userId;
    Book.findOne({_id: req.params.id})
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message : 'Not authorized'});
            } else {
                Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'livre modifié!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
 };

exports.rateBook = (req, res, next) => { 
    const { userId, rating } = req.body
        if (rating < 0 || rating > 5) {
            return res.status(400).json({ message: 'la note est un nombre non valide' })
        }
        
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (!book) {
                return res.status(404).json({ message: 'Livre non trouvé !'})
            }

    const existingRating = book.ratings.find((rating) => rating.userId === userId)
        if (existingRating) {
        return res.status(400).json({ message: 'Vous avez déjà noté ce livre.'})
        }
            //pour ajouter la note dans le tableau
            book.ratings.push({ userId, grade: rating })

            // recalculer la moyenne des notes
            const totalRatings = book.ratings.length
            const averageRating = book.ratings.reduce((sum, ratingItem) => sum + ratingItem.grade, 0) / totalRatings
                
                book.averageRating = Math.round(averageRating * 10) / 10 //limite à une décimale

            book.save()
                .then((updateBook) => {
                    res.status(200).json(updateBook)
                })
                .catch((error) => {
                    res.status(500).json({ error })
                })
        })
        .catch((error) => {
            res.status(500).json({ error })
        })
}

exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message: 'Non autorisé' })
            } else {
                const filename = book.imageUrl.split('/images/')[1]
                fs.unlink(`images/${filename}`, () => {
                     Book.deleteOne({_id: req.params.id})
                        .then(() => {
                            res.status(200).json({ message: 'Livre supprimé !' })})
                        .catch((error) => {
                            res.status(401).json({ error: error })})
                })
            }
    })
        .catch(error => {
            res.status(500).json({ error })
        })
}
