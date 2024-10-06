import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"



// Configuration
cloudinary.config({ 
    cloud_name: process.env.Cloudname, 
    api_key: process.env.APIkey, 
    api_secret: process.env.APIsecret,
});

const uploadOnCloudinary= async (localfilepath)=>{
    try{
        if(!localfilepath) return null
        const uploadResult = await cloudinary.uploader.upload(
            localfilepath, {
            resource_type: 'auto'
        }
        )
        return uploadResult
    }catch(error){
        fs.unlinkSync(localfilepath) //remove uploaded file
        console.log(error);
        return null;
    }
    console.log(uploadResult);
}

export {uploadOnCloudinary}
// (async function() {    
//     const uploadResult = await cloudinary.uploader
//     .upload(
//         'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
//             public_id: 'shoes',
//         }
//     )
//     .catch((error) => {
//         console.log(error);
//     });
 
//     console.log(uploadResult);
    
//     // Optimize delivery by resizing and applying auto-format and auto-quality
//     const optimizeUrl = cloudinary.url('shoes', {
//         fetch_format: 'auto',
//         quality: 'auto'
//     });
    
//     console.log(optimizeUrl);
    
//     // Transform the image: auto-crop to square aspect_ratio
//     const autoCropUrl = cloudinary.url('shoes', {
//         crop: 'auto',
//         gravity: 'auto',
//         width: 500,
//         height: 500,
//     });
    
//     console.log(autoCropUrl);    
// })();