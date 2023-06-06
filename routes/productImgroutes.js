const express = require("express");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const {
  createProductImg,
  updateProductController,
  getProductController,
  getSingleProductController,
  productPhotoController,
  deleteProductController,
} = require("../controller/productImgCtrl");
const router = express.Router();
const formidable = require("express-formidable");

router.post(
  "/create-product",
  authMiddleware,
  isAdmin,
  formidable(),
  createProductImg
);

//routes
router.put(
  "/update-product/:pid",
  authMiddleware,
  isAdmin,
  formidable(),
  updateProductController
);

//get products
router.get("/get-product", getProductController);

//single product
router.get("/get-product/:slug", getSingleProductController);

//get photo
router.get("/product-photo/:pid", productPhotoController);

//delete rproduct
router.delete("/product/:pid", deleteProductController);

module.exports = router;
