function errorHandler (err, req, res, next) {
    
    if (err.name === 'SequelizeValidationError') {
        res.status(400).json({message: err.errors.map((err) => err.message)})
    } else if (err.name === 'SequelizeUniqueConstraintError') {
        res.status(400).json({message: err.errors.map((err) => err.message)})
    } else if (err.name === 'PenalizedMember') {
        res.status(400).json({message: 'You are being penalized, please return within 3 days to borrow the book again.' })
    } else if (err.name === 'MaximumLimit') {
        res.status(400).json({message: 'You already borrowed 2 books, please return 1 book so you can borrow another' })
    } else if (err.name === 'NotAvailable') {
        res.status(400).json({message: 'Book already borrowed by another member, chose another' })
    } else if (err.name === 'NotBorrowed') {
        res.status(400).json({message: 'You are not borrowing that book' })
    } else if (err.name === 'MemberNotFound') {        
        res.status(404).json({message: "Member is not found" })
    } else {
        res.status(500).json({message: `Internal Server Error`})
    }
}

module.exports = errorHandler;