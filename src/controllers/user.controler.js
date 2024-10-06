import { asyncHandler } from "../utils/asynchandeler.js";
import { ApiError } from "../utils/apierror.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiRisponse } from "../utils/apiResponse.js";
import { upload } from "../middlewares/multer.middlewares.js";

const generateAccessandRefreshToken=async(userid)=>{
    try {
       const user=await User.findById(userid)
       const ACCESSTOKEN=user.generateAccessToken()
       const RefreshToken=user.generateRefreshToken()
       user.refreshToken=RefreshToken
       await user.save({ validateBeforeSave: false })
    } catch (error) {
        throw new ApiError(500,"Errorr in generating token")
    }
    return {ACCESSTOKEN,RefreshToken}
}

const registerUser= asyncHandler(async (req,res)=>{
    const {fullName,password ,username,email}=req.body //Take data from frontend
    if(username===""){ //validation "empty"
        if (
            [fullName, email, username,password].some((field)=>
                field?.trim()=== ""
            )
        ) {
            throw new ApiError(400,"all-Field-Requiered",)
        }
    }

    const existingEmail =await User.findOne({ email: email });
    if (existingEmail){
        throw new ApiError(200,"Email Error")
    }
    const existingUsername =await User.findOne({ email: email });
    if (existingUsername){
        throw new ApiError(409,"Username-Exist")
    }
    
    const avatarLocal = req.files?.avatar?.[0]?.path || null;
    const CoveImageLocal = req.files?.CoveImage?.[0]?.path || null;
    // Debug: Log the file paths to check if they are being correctly retrieved
    console.log("Avatar Path:", avatarLocal);
    console.log("Cover Image Path:", CoveImageLocal);
    if (!avatarLocal) {
        throw new ApiError(400,"Avatar-Needed");
    }
    const avatar=await uploadOnCloudinary(avatarLocal)
    const CoveImage=await uploadOnCloudinary(CoveImageLocal)
    console.log("uploaded")
    if(!avatar){
        throw new ApiError(400,"Avatar-Needed");
    }
    
    const user=await User.create({
        fullName:fullName,
        avatar: avatar.url,
        CoveImage:CoveImage?.url || "",
        email:email,
        password:password,
        username: username.toLowerCase()
    })
    const CreatedUser= await User.findById(user._id).select("-password -refreshToken")
    if (!CreatedUser) {
        throw new ApiError(500,"Sever don't store user")
    }
    return res.json(new ApiRisponse(201,CreatedUser,"User Registered"))
})

const loginUser= asyncHandler(async (req,res)=>{
    const {email,username,password}=req.body
    if (!username || !email){
        throw new ApiError(400,"usename or email required")
    }
    const user=await User.findOne({
        $or: [{username},{email}]
    })

    if (!user) {
        throw new ApiError(400,"Use Not Exist")
    }
    if (!(await user.isPasswordCorrect(password))) {
        throw new ApiError(400,"InvalidCredentials")
    }

    const {ACCESSTOKEN,RefreshToken}=await generateAccessandRefreshToken(user._id)
    user.refreshToken= RefreshToken
    
    const options ={
        httpOnly:true ,
        secure: true
    }

    return res.status(200).cookie("accessToken",ACCESSTOKEN,options).cookie("refreshToken",RefreshToken,options).json(
       new ApiRisponse(
        200,{
            accessToken:ACCESSTOKEN,
            refreshToken:RefreshToken,
            user:user
        },
        "User Loged in sucessfully"
       )
    )
})

const logoutUser = asyncHandler(async(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{
        $set: {
            refreshToken: undefined
        }
    },
    {
        new: true
    }
    )

    const options ={
        httpOnly:true ,
        secure: true
    }
    return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json(new ApiRisponse(200,"Use Logged Out"))
    
})

export {registerUser,loginUser,logoutUser}