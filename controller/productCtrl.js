const Product = require("../models/productModels");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const fs = require('fs')


/* const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (error) {
    throw new Error(error);
  }
}); */
const createProduct = async (req, res) => {
  try {
    const{
        title , slug , description, price , category, quantite,  tags ,brand
    } = req.fields
    const {photo} = req.files
    //alidation
switch (true) {
    case !title:
      return res.status(500).send({ error: "title is Required" });
    case !description:
      return res.status(500).send({ error: "Description is Required" });
    case !price:
      return res.status(500).send({ error: "Price is Required" });
    case !category:
      return res.status(500).send({ error: "Category is Required" });
      case !tags:
      return res.status(500).send({ error: "tags is Required" });
      case !brand:
        return res.status(500).send({ error: "brand is Required" });
        case !quantite:
      return res.status(500).send({ error: "Quantity is Required" });
    case photo && photo.size > 1000000:
      return res
        .status(500)
        .send({ error: "photo is Required and should be less then 1mb" });
  }

    const products = new Product({ ...req.fields, slug: slugify(title) });
    if (photo) {
        products.photo.data = fs.readFileSync(photo.path);
        products.photo.contentType = photo.type;
      }
      await products.save();
      res.status(201).send({
        success: true,
        message: "Product Created Successfully",
        products,
      });
} catch (error) {
    console.log(error);
    res.status(500).send({
        success:false,
        error,
        message: 'Error in creating Product'
    })
}
};

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updateProduct = await Product.findOneAndUpdate(id, req.body, {
      new: true,
    });

    res.json(updateProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  /* console.log(req.params); */
  const { id } = req.params;
  try {
    const deleteProduct = await Product.findByIdAndDelete(id);

    res.json({ deleteProduct });
  } catch (error) {
    throw new Error(error);
  }
});

const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const findProduct = await Product.findById(id).populate("color");
    res.json(findProduct);
  } catch (error) {
    throw new Error(error);
  }
});

/* const getAllProduct = asyncHandler( async (req, res) => {
  try {
    const getallProducts = await Product.find();
    res.json(getallProducts);
  } catch (error) {
    throw new Error(error);
  }
}); */
const getAllProduct = asyncHandler(async (req, res) => {
  try {
    // Filtering
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Product.find(JSON.parse(queryStr));

    // Sorting

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // limiting the fields

    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // pagination

    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip >= productCount) throw new Error("This Page does not exists");
    }
    const product = await Product.find().populate("color", "title");
    res.json(product);
  } catch (error) {
    throw new Error(error);
  }
});

const addTowishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { prodId } = req.body;
  try {
    const user = await User.findById(_id);
    const alreadyadded = user.wishlist.find((id) => id.toString() === prodId);
    if (alreadyadded) {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $pull: { wishlist: prodId },
        },
        {
          new: true,
        }
      );
      res.json(user);
    } else {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $push: { wishlist: prodId },
        },
        {
          new: true,
        }
      );
      res.json(user);
    }
  } catch (error) {
    throw new Error(error);
  }
});

const rating = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, prodId, comment } = req.body;
  try {
    const product = await Product.findById(prodId);
    let alreadyRated = product.ratings.find(
      (userId) => userId.postedby.toString() === _id.toString()
    );
    if (alreadyRated) {
      const updateRating = await Product.updateOne(
        {
          ratings: { $elemMatch: alreadyRated },
        },
        {
          $set: { "ratings.$.star": star, "ratings.$.comment": comment },
        },
        {
          new: true,
        }
      );
      /* res.json(updateRating); */
    } else {
      const rateProduct = await Product.findByIdAndUpdate(
        prodId,
        {
          $push: {
            ratings: {
              star: star,
              comment: comment,
              postedby: _id,
            },
          },
        },
        { new: true }
      );
      /*  res.json(rateProduct); */
    }
    const getallrating = await Product.findById(prodId);
    let totalRating = getallrating.ratings.length;
    let ratingsum = getallrating.ratings
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0);
    let actualRating = Math.round(ratingsum / totalRating);
    let finalproduct = await Product.findByIdAndUpdate(
      prodId,
      {
        totalrating: actualRating,
      },
      { new: true }
    );
    res.json(finalproduct);
  } catch (error) {
    throw new Error(error);
  }
});

const topProduct = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ totalrating: -1 }) // Tri par note totale décroissante
      .populate("color") // Populez le champ couleur pour chaque produit
      .populate("ratings.postedby", "name") // Populez le nom de l'utilisateur pour chaque commentaire
      .exec();

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});
const ajouter_vote = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
 
    
    const produit = await Product.findById({ _id: req.params.id });
    //produit.vote.userid=_id;
    const array=[]
    //array.push(userid)
    console.log(produit.vote.userid)
    const update_vote = await Product.findByIdAndUpdate(
      { _id: req.params.id },
      {$push: {
        vote: {
          userid: _id,
         
        },
       
      }, total_vote:produit.total_vote+1}
     

     
    );
    const update_vote_user= await User.findByIdAndUpdate({_id:_id},
      {$push: {
        vote_user: {
          etat:true
        },
       
      }}
      
      )
    res.json(update_vote);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = {
  createProduct,
  getProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  addTowishlist,
  rating,
  topProduct,
  ajouter_vote,
};
