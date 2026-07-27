const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    // catch the token from the request headers
    const authHeader = req.headers['authorization'];

    // if the token is not present, return an error
    if (!authHeader) {
        console.log('No token provided');
        return res.status(401).json({ error: "no token provided" });
    }

    // split the token from the "Bearer" prefix
    const token = authHeader.split(' ')[1];

    if (!token) {
        console.log('Invalid token format');
        return res.status(401).json({ error: "invalid token format" });
    }

    // check if the token is valid
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next();             
    } catch (error) {
        console.log('Token verification failed');
        return res.status(401).json({ error: "token verification failed" });
    }
}

module.exports = authMiddleware;