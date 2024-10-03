import { asyncHandler } from "../utils/asynchandeler.js";

const registerUser= asyncHandler(async (req,res)=>{
    res.status(500).json(
        {
            message: "S.Kji"
        }
    )
})

export {registerUser}