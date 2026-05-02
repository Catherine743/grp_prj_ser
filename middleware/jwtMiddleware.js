const jwt = require('jsonwebtoken')
const jwtMiddleware = (req, res, next) => {
    console.log("Inside jwtMiddleware");
    // get-Token
    const token = req.headers.authorization.split(" ")[1]
    // console.log(token);
    if (token) {
        // verify token
        try {
            const jwtResponse = jwt.verify(token, process.env.jwtSecret)
            // console.log(jwtResponse);
            req.payload = jwtResponse.email
            next()
        }
        catch (err) {
            res.status(401).json("Authorization failed!!! Invalid Token")
        }

    }
    else {
        res.status(401).json("Authorization failed!!! Please Provide Token")
    }
}

module.exports = jwtMiddleware