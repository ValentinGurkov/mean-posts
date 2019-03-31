const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        jwt.verify(token, 'some super c-sec long secret that should be super secure')
        next()
    } catch (error) {
        res.status(401).json({ message: 'Not authenticated'})
    }


}