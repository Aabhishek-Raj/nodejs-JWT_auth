const mongoose = require("mongoose")
const { isEmail } = require("validator")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : [true, "please enter an Email"],
        unique : true,
        lowercase : true,
        validate : [isEmail, "Enter a VALID email"]
    },
    Password : {
        type : String,   
        required : [true, "Please enter a Password"],  
        minlength : [5, " Password must be atleast 5 characters"]

    }       
}) 

userSchema.pre("save", async function(next){
    const salt =await bcrypt.genSalt()
    this.Password = await bcrypt.hash(this.Password, salt) 
   next()
})  
userSchema.statics.login = async function(email, Password){
    const user = await this.findOne({email}) 

    if (user){
        const auth =await bcrypt.compare(Password, user.Password)
        if(auth){
            return user
        }
        throw Error("Incorrect Password")
    }
    throw Error("Incorrect email Id")
}  
    


const User = mongoose.model("user", userSchema)  

module.exports = User