const{createHmac,randomBytes} = require("node:crypto");
const mongoose = require("mongoose");
const{createtokenforuser} = require("../service/authentication");
const userschema = new mongoose.Schema({
    fullname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    salt:{
        type:String,
        
    },

    password:{
        type:String,
        required:true,
    },
    profileimageurl:{
        type:String,
        default:"/images/userimage.jpg",
    },
    role:{
        type:String,
        enum:["USER","ADMIN"],
        default:"USER",
    },
},
{timestamps:true}
);
userschema.pre("save",function (next) {
    const user = this;
    if(!user.isModified("password")) return;

    const salt = randomBytes(16).toString();

    const hashedpassword = createHmac('sha256',salt)
    .update(user.password)
    .digest("hex");
    
    this.salt = salt;
    this.password= hashedpassword;
    next();



});

userschema.static("matchpasswordandgenratetoken",async function(email,password){
    const user = await this.findOne({email})
    if(!user) throw new Error("user not found");

    const salt = user.salt;
    const hashedpassword=user.password;

    const userprovidedhash = createHmac('sha256',salt)
    .update(password)
    .digest("hex");

    if(hashedpassword!==userprovidedhash) throw new Error("incorrect password");

    const token = createtokenforuser(user);
    return token;
})

;

const User = new mongoose.model("user",userschema);
module.exports = User;
        

    


