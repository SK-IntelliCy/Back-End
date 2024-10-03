import { Router } from "express";
import { registerUser } from "../controllers/user.controler.js";

const rout=Router()
rout.route("/register").post(registerUser)

export default rout