const express= require('express');
const { 
    uploadImages,
    deleteImages
} = require('../controller/uploadCtrl');
const { isAdmin , authMiddleware} = require('../middlewares/authMiddleware');
const { uploadPhoto, productImgResize } = require('../middlewares/uploadimages');
const router = express.Router();

/* router.put('/upload/:id' , authMiddleware , isAdmin , 
uploadPhoto.array('images',10),
productImgResize,
uploadImages); */
router.post('/' , authMiddleware , isAdmin , 
uploadPhoto.array('images',10),
productImgResize,
uploadImages);

router.delete('/delete-img/:id', authMiddleware, isAdmin, deleteImages); 



module.exports = router;