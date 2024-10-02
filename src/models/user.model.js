import mongoose ,{Schema, Types}from "mongoose";

import { JsonWebTokenError } from "jsonwebtoken";
import bcrypt from "bcrypt"
const userSchema = new Schema(
    {
        username:{
            type:String,
            required: true,
            unique: true,
            lowecase:true,
            trim:true,
            index:true,
        },
        email:{
            type:String,
            required: true,
            unique: true,
            lowecase:true,
            trim:true,
        },
        fullname :{
            type:String,
            required: true,
            trim:true,
            index:true,
        },
        avatar:{
            type: String,//cloudinary 
            required:true,
        },
        coverImage:{
            type: String,//cloudinary 
        },
        watchHistory:[
            {
                Type:Schema.Types.ObjectId,
                ref:"video"
            }
        ],
        password:{
            type:String,
            required:true,
        },
        refreshToken:{
            type:String,
        }
    },
    {
        timestamps:true
    }
)
userSchema.pre("save",async function (next) {
    if(!this.isModified("pasword")){
        return next();
    }
    this.password=await bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.isPasswordCorrect=async function (password) {
    return await bcrypt.compare(password,this.password)
}
userSchema.methods.generateAcessToken=async function () {
    return JsonWebTokenError.sign(
        {
            id: this.id,
            username: this.username
        },
        process.env.ACESS_TOKEN_SECERT,
        {
            expiresIn: process.env.ACESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken= async function (params) {
    return JsonWebTokenError.sign(
        {
            id: this.id,
            username: this.username
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.ACESS_TOKEN_EXPIRY
        }
    )
}

export const User =mongoose.model("User",userSchema)