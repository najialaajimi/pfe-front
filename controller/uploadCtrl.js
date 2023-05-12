const asyncHandler = require("express-async-handler");
const {cloudinaryUploadImg , cloudinaryDeleteImg } = require('../utils/cloudinary');
const { validateMongodbID } = require("../utils/validateMongodbid");
const fs = require('fs');


const uploadImages = asyncHandler( async (req, res) => {
    /* const {id} = req.params;
    validateMongodbID(id); */
    try {
      const uploader = (path) => cloudinaryUploadImg(path , 'images');
      const urls = [];
      const files = req.files;
      for(const file of files){
        const {path} = file;
        const newpath = await uploader(path);
        urls.push(newpath);/* 
        console.log(file); */
        fs.unlinkSync(path);
      }
      const images = urls.map((file)=> {
        return file;
      })
      res.json(images);
      /* const findProduct = await Product.findByIdAndUpdate(
        id, {
          images:urls.map((file) => {
            return file;
          }),
        }, {
          new: true ,
        }
      );
      res.json(findProduct); */
    } catch (error) {
      throw new Error(error);
    }
  });
  
  const deleteImages = asyncHandler( async (req, res) => {
    const {id} = req.params;
    try {
      const deleted =cloudinaryDeleteImg(id , 'images');
      res.json({message : "Deleted"})
     
      /* const findProduct = await Product.findByIdAndUpdate(
        id, {
          images:urls.map((file) => {
            return file;
          }),
        }, {
          new: true ,
        }
      );
      res.json(findProduct); */
    } catch (error) {
      throw new Error(error);
    }
  });
  


  module.exports ={
    uploadImages,
    deleteImages
  }