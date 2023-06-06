const mongoose = require("mongoose");

const productImgSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        slug:{
            type: String,
            required : true,
        },
        description:{
            type:String,
            required:true
        },
        price:{
            type: Number,
            required : true,
        },
        category:{
            type: String,
            required:true
        },
        brand:{
            type: String,
            required:true
        },
        quantity:{
            type: Number,
            required : true,
        },
        photo:{
            data:Buffer,
            contentType:String
        },
        color:{
            type: String,
        },
    },{
        timestamps: true,
    }
);


module.exports = mongoose.model('ProductImg', productImgSchema);