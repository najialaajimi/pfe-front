const express= require('express');
const { 
    createProduct, 
    getProduct, 
    getAllProduct, 
    updateProduct, 
    deleteProduct,
    addTowishlist,
    rating,
    topProduct,ajouter_vote
} = require('../controller/productCtrl');
const { isAdmin , authMiddleware} = require('../middlewares/authMiddleware');
const router = express.Router();
const formidable = require("express-formidable");

router.post('/', authMiddleware, isAdmin,formidable(), createProduct);
/* router.put('/upload/:id' , authMiddleware , isAdmin , 
uploadPhoto.array('images',10),
productImgResize,
uploadImages); *//* 
router.post('/upload' , authMiddleware , isAdmin , 
uploadPhoto.array('images',10),
productImgResize,
uploadImages); */
router.put('/update/:id', authMiddleware, isAdmin, updateProduct); 
router.delete('/delete/:id', authMiddleware, isAdmin, deleteProduct); /* 
router.delete('/delete-img/:id', authMiddleware, isAdmin, deleteImages);  */
router.put('/wishlist',authMiddleware, addTowishlist);
router.put('/rating',authMiddleware, rating);
router.get('/:id', getProduct);
router.get('/', getAllProduct);
router.get('/top', topProduct);
router.put('/vote/:id',authMiddleware,ajouter_vote)

module.exports = router;