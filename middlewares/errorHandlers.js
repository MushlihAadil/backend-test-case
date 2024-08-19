function errorHandler (err, req, res, next) {
    
    if (err.name === 'SequelizeValidationError') {
        res.status(400).json({message: err.errors.map((err) => err.message)})
    } else if (err.name === 'SequelizeUniqueConstraintError') {
        res.status(400).json({message: err.errors.map((err) => err.message)})
    } else {
        res.status(500).json({message: `Internal Server Error`})
    }
}

module.exports = errorHandler;