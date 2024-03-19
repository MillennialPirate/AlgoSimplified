const jwt = require('jsonwebtoken'); 

verifyToken = (req, res, next) => {

    // get the token from the request header or query parameters
    const token = req.headers['authorization'];  

    // check if the token exists 
    if(!token){
        return res.status(401).json({message : 'Unauthorized: No token provided'}); 
    }

    // verify the token 
    jwt.verify(token, 'secret', (err, decoded) => {
        if(err){
            return res.status(401).json({message : 'Unauthorized : Invalid token'}); 
        }
        req.user = decoded; 
        next(); 
    })
}

module.exports = {verifyToken}