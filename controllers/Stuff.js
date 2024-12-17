const Book = require('../models/Book')

exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book)
    delete bookObject._id
    delete bookObject._userId
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    })

    book.save()
    .then(() => { res.status(201).json({ message: 'Livre enregistré !' })})
    .catch(error => { res.status(400).json({ error })})
    
    
    //ancien code
    /*console.log('Données reçues :', req.body)
    const book = new Book({
        ...req.body
    })
    book.save()
        .then(() => res.status(201).json({ message: 'Livre enregistré !'}))
        .catch(error => {
            console.error('Erreur lors de la save :', error)
            res.status(400).json({ error })
        })*/
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
    Book.updateOne(
        { _id: req.params.id }, 
        { ...req.body, _id: req.params.id }
    )
    .then(() => res.status(201).json({ message: 'Livre modifié !' }))
    .catch(error => res.status(400).json({ error }));
}

exports.rateBook = (req, res, next) => {
    const { userId, grade } = req.body
        if (grade < 0 || grade > 5) {
           return res.status(400).json({ message: 'La note doit être comprise entre 0 et 5.'})
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
            book.rating.push({ userId, grade })

            // recalculer la moyenne des notes
            const totalRatings = book.ratings.length
            const averageRating = book.ratings.reduce((sum, rating) => sum + rating.grade, 0)
            
            book.averageRating = averageRating

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
    Book.deleteOne({_id: req.params.id})
    .then(() => {
        res.status(200).json({ message: 'Deleted !' })
    })
    .catch((error) => {
        res.status(400).json({ error: error })
    })
}
