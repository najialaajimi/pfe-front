const router = require('express').Router()
const multer = require('multer')
const mongoose = require('mongoose')
const { v4: uuidv4} = require('uuid');

const path = require('path')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null,file.originalname)
    }
});

var upload = multer({ storage: storage })

router.post("/upload_files",upload.single("files"),async (req , res) =>{
    let file = req.file
    console.log(file);
    res.json({message : "Successffully uploaded files" , result: file})
});


module.exports = router