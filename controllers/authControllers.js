const userSchema = require('../models/userSchema')
const jwt = require("jsonwebtoken")



//Handle Errors------------>
const handleErrors = (err) => {
    console.log(err.message, err.code); 
    const error = { email : "", Password : ""} 



//inncorrect email
if(err.message === "Incorrect email Id"){
    error.email = "That email is not registered"
    return error
}

//inncorrect password
if(err.message === "Incorrect Password"){
    error.Password = "That password is not correct"
    return error
}


//repetition of email-------->
if(err.code === 11000){
    error.email = "YOU ALREADY HAVE AN ACCOUNT"
    
    return error       
}

//validation errors---------->
if (err.message.includes("user validation failed")){
   Object.values(err.errors).forEach(({properties}) => {
    error[properties.path] = properties.message       
   })        
}  
    return error      
}  
const maxAge = 3 * 24 * 60 * 60

const createToken = (id) => {
    return jwt.sign({id}, "there is a secret", {
        expiresIn : maxAge
    })
}

module.exports.signup_get = (req, res) => {    
    res.render("signup")
}
module.exports.login_get = (req, res) => {           
    res.render("login")
}     
 

module.exports.signup_post = async (req, res) => {
      
    const {email, Password}= req.body 
    // console.log(email, Password); 

    try{
        const user = await userSchema.create({email, Password})
        const token = createToken(user._id)
        res.cookie("jwt", token, { httpOnly : true, maxAge : maxAge * 1000, })
        res.status(201).json({user : user._id})
    }
    catch(err){        
       const errors = handleErrors(err)
        res.status(401).json({errors}) 
    }
}
        
module.exports.login_post = async (req, res) => { 
    const {email, Password} = req.body  
    try {
     const user = await userSchema.login(email, Password) 
     const token = createToken(user.id)
     res.cookie("jwt", token, { httpOnly: true, maxAge : maxAge * 1000 })
    res.status(200).json({user : user.id})
    }  
    catch (err){
        const errors = handleErrors(err)
        res.status(400).json({errors})

    }      
} 

module.exports.logout_get = (req, res) => {
    res.cookie('jwt', "", { maxAge : 1 })
    res.redirect('/')
}