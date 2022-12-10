const jwt = require("jsonwebtoken")
const userSchema = require('../models/userSchema')

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt

    // checking the existance of web token

    if (token){
        jwt.verify(token, "there is a secret", (err, decodedToken) => {
            if (err){
                console.log(err.message);
                res.redirect("/login")
            } else{
                console.log(decodedToken);
                next()
            }
        })
    } else{
        res.redirect('/login')
    }
}



//Checking current user

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt

    if (token){
        jwt.verify(token, "there is a secret", async (err, decodedToken) => {
            if (err){
                console.log(err.message);
                res.locals.user = null
            } else{  
                console.log(decodedToken);
                let user = await userSchema.findById(decodedToken.id)
                res.locals.user = user
                next()
            }
        })
    }else{
        res.locals.user = null
        next()
    }

}




module.exports = { requireAuth, checkUser }