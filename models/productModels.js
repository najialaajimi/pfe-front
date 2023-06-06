const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    quantite: {
      type: Number,
      required: true /* 
      select : false, bech matafichihomech */,
    },
    sold: {
      type: Number,
      default: 0 /* 
      select : false, bech matafichihomech */,
    },
    photo: {
      data: Buffer,
      contentType: String
    },
    color: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Color",
      },
    ],
    tags: String,
    ratings: [
      {
        star: Number,
        comment: String,
        postedby: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    vote: [
      {
        userid: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        data: {
          type: String,
          default: new Date().getMonth()+1,
        },
      },
    ],
    total_vote: {
      type: Number,
      default:0
    },
    totalrating: {
      type: String,
      default: 0,
    },
    moins:{
      type:Number,
      default: new Date().getMonth()+1 }
  },
   
);

//Export the model
module.exports = mongoose.model("Product", ProductSchema);
