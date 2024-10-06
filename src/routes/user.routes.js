import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controler.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { VerifyJWT } from "../middlewares/auth.middelware.js";

const rout=Router()
rout.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, 
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)

rout.route("/login").post(loginUser)

rout.route("/logout").post(VerifyJWT,logoutUser)


export default rout