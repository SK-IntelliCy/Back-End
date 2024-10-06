import { ApiError } from "../utils/apierror.js";
import { asyncHandler } from "../utils/asynchandeler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";


export const VerifyJWT=asyncHandler(async(req,res,next)=>{
    try {
        const token=req.cookies?.accessToken||req.header("Authorisation")?.replace("Bearer ","")
        if (!token) {
            throw new ApiError(401, "Unauthorised request")
        }
        const Info=await jwt.verify(token,process.env.ACESS_TOKEN_SECERT)
        const user =await User.findById(Info?._id).select("-password -refreshToken")
        if (!user) {
            throw new ApiError(401,"Invalid Acess Token")
        }
        req.user=user;
        next()
    } catch (error) {
        throw new ApiError(401,"User Not found")
    }
})