const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    const token = req.header('x-access-token');
    if(!token) return res.status(401).json({error: 'Access denied. No token provided.'});

    try{
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET_KEY);
        req.user = decoded;
        next();
    }catch(_){
        return res.status(400).json({error: 'Invalid token.'});
    }
}

module.exports = auth;