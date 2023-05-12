const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const { validateMongodbID } = require("../utils/validateMongodbid");
const { generateRefreshToken } = require("../config/refreshtoken");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../controller/emailCtrl");
const crypto = require("crypto");
const uniqid = require("uniqid");
const Cart = require("../models/cartModel");
const Product = require("../models/productModels");
const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel");

//create a User
const createUser = asyncHandler(async (req, res) => {
  //const email = req.body.email;
  const { firstname, lastname, email, mobile, password } = req.body;
  let r = (Math.random() + 1).toString(36).substring(7);
  const bureau = [
    {
      bureau1: {
        nom: "b001",
        code: r + "b001",

        extD: [],
        extG: [],
        linkD: [],
        linkG: [],
      },
    },
  ];
  const findUser = await User.findOne({ email });
  if (!findUser) {
    //create a new user
    const newuser = new User({
      firstname,
      lastname,
      email,
      mobile,
      password,
      bureau: bureau,
    });
    const user = await newuser.save();
    res.json(user);
  } else {
    throw new error("User Already Exists");
  }
});

//login a user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //check if user exists or not
  const findUser = await User.findOne({ email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findUser?._id);
    const updateuser = await User.findByIdAndUpdate(
      findUser.id,
      {
        refreshToken: refreshToken,
      },
      {
        new: true,
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      codeAdherent: findUser?.codeAdherent,
      role: findUser?.role,
      bureau: findUser?.bureau,
      token: generateToken(findUser?._id),
    });
  } else {
    throw new Error("invalid credentials");
  }
});

const Ajouteruserdroite = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { userid } = req.body;
  try {
    const user = await User.findById({ _id: _id });
    const element = user.bureau.map((e) => e.bureau1);
    if (element[0].linkD.length === 0) {
      element[0].linkD.push(userid);
      element[0].extD = userid;
      const newuser = await User.findOneAndUpdate(
        { _id: _id },
        { bureau: user.bureau }
      );
      res.json(newuser)
    } else {
      const finduser2 = await User.findById({ _id: element[0].extD });
      const element2 = finduser2.bureau.map((e) => e.bureau1);
      if (element2[0].linkD.length === 0) {
        element2[0].linkD.push(userid);
        element2[0].extD = userid;

        const newuser2 = await User.findOneAndUpdate(
          { _id: element[0].extD },
          { bureau: finduser2.bureau }
        );
        element[0].extD = element2[0].extD;
        const newuser = await User.findOneAndUpdate(
          { _id: _id},
          { bureau: user.bureau }
        );

        await User.updateMany({}, { $set: { bureau: finduser2.bureau } });
        res.json(user)
      }
      else{
        element2(0).extD=userid
        const newuser2 = await User.findOneAndUpdate(
          { _id: element[0].extD },
          { bureau: finduser2.bureau }
        );
        element[0].extD = element2[0].extD;
        const newuser = await User.findOneAndUpdate(
          { _id: _id},
          { bureau: user.bureau }
        );
        res.json(user)
        
      }
    }

  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});
//login a admin
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //check if user exists or not
  const findAdmin = await User.findOne({ email });
  if (findAdmin.role !== "admin") throw new Error("Not Authorised");
  if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findAdmin?._id);
    const updateuser = await User.findByIdAndUpdate(
      findAdmin.id,
      {
        refreshToken: refreshToken,
      },
      {
        new: true,
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id: findAdmin?._id,
      firstname: findAdmin?.firstname,
      lastname: findAdmin?.lastname,
      email: findAdmin?.email,
      mobile: findAdmin?.mobile,
      token: generateToken(findAdmin?._id),
    });
  } else {
    throw new Error("invalid credentials");
  }
});

//handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  /* console.log(cookie); */
  if (!cookie?.refreshToken) throw new Error("No refresh token in Cookies");
  const refreshToken = cookie.refreshToken;
  /* console.log(refreshToken); */
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error("No Refresh token present in db or not matched");
  /* res.json(user); */
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    /* console.log(decoded); */
    if (err || user.id !== decoded.id) {
      throw new Error("There is something wrong with refresh token");
    }
    const accessToken = generateToken(user?._id);
    res.json({ accessToken });
  });
});

//logout functionnality
const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No refresh token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); //forbidden
  }
  await User.findOneAndUpdate(refreshToken, {
    refreshToken: "",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204); //forbidden
});

//get all users
const getallUser = async (req, res) => {
  try {
    const getUsers = await User.find();
    res.json(getUsers);
  } catch (error) {
    throw new Error(error);
  }
};

//get a single user
const getUser = asyncHandler(async (req, res) => {
  /* console.log(req.params); */
  const { id } = req.params;
  validateMongodbID(id);
  try {
    const getUser = await User.findById(id);
    res.json({ getUser });
  } catch (error) {
    throw new Error(error);
  }
});

//delete  user
const deleteUser = asyncHandler(async (req, res) => {
  /* console.log(req.params); */
  const { id } = req.params;
  validateMongodbID(id);
  try {
    const deleteUser = await User.findByIdAndDelete(id);
    res.json({ deleteUser });
  } catch (error) {
    throw new Error(error);
  }
});

//update a user
const updateUser = asyncHandler(async (req, res) => {
  /*  console.log(); */
  const { _id } = req.user;
  validateMongodbID(_id);
  try {
    const updateUser = await User.findByIdAndUpdate(
      _id,
      {
        firstname: req?.body?.firstname,
        lastname: req?.body?.lastname,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
      },
      {
        new: true,
      }
    );
    res.json({ updateUser });
  } catch (error) {
    throw new Error(error);
  }
});

//block user
const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbID(id);
  try {
    const block = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    res.json({ block });
  } catch (error) {
    throw new Error(error);
  }
});

//unblock user
const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbID(id);
  try {
    const unblock = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    res.json({ unblock });
  } catch (error) {
    throw new Error(error);
  }
});

const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  validateMongodbID(_id);
  const user = await User.findById(_id);
  if (password) {
    user.password = password;
    const updatedPassword = await user.save();
    res.json(updatedPassword);
  } else {
    res.json(user);
  }
});

const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found with this email");
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetURL = `HI , Please follow this link to reset your Password.This link is valid till 10 minutes from now. <a href='http://localhost:3001/reset-password/${token}'>Click Here</a>`;
    const data = {
      to: email,
      text: "Hey user",
      subject: "Forgot Password Link",
      htm: resetURL,
    };
    sendEmail(data);
    res.json(token);
  } catch (error) {
    throw new Error(error);
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.Now() },
  });
  if (!user) throw new Error("token Expired , Please try again later");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json(user);
});

const getWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const findUser = await User.findById(_id).populate("wishlist");
    res.json(findUser);
  } catch (error) {
    throw new Error(error);
  }
});

//save user Address
const saveAddress = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  validateMongodbID(_id);
  try {
    const saveAddress = await User.findByIdAndUpdate(
      _id,
      {
        address: req?.body?.address,
      },
      {
        new: true,
      }
    );
    res.json({ saveAddress });
  } catch (error) {
    throw new Error(error);
  }
});
const userCart = asyncHandler(async (req, res, next) => {
  const { productId, color, quantity, price } = req.body;
  const { _id } = req.user;
  validateMongodbID(_id);
  try {
    if (color !== null) {
      let newCart = await new Cart({
        userId: _id,
        productId,
        color,
        price,
        quantity,
      }).save();
      res.json(newCart);
    } else {
      let newCart = await new Cart({
        userId: _id,
        productId,
        price,
        quantity,
      }).save();
      res.json(newCart);
    }
    /* console.log(newCart) */
  } catch (error) {
    throw new Error(error);
  }
});

const getUserCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongodbID(_id);
  try {
    const cart = await Cart.find({ userId: _id })
      .populate("productId" /* , "_id title price totalAfterDiscount" */)
      .populate("color");
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

const removeProductFromCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { cartItemId } = req.params;
  validateMongodbID(_id);
  try {
    const removeProductFromCart = await Cart.deleteOne({
      userId: _id,
      _id: cartItemId,
    });
    res.json(removeProductFromCart);
  } catch (error) {
    throw new Error(error);
  }
});

const updateProductQuantityFromCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { cartItemId, newQuantity } = req.params;
  validateMongodbID(_id);
  try {
    const cartItem = await Cart.findOne({ userId: _id, _id: cartItemId });
    cartItem.quantity = newQuantity;
    cartItem.save();
    res.json(cartItem);
  } catch (error) {
    throw new Error(error);
  }
});

const createOrder = asyncHandler(async (req, res) => {
  const {
    shippingInfo,
    orderItems,
    totalPrice,
    totalPriceAfterDiscount,
    paymentInfo,
  } = req.body;
  const { _id } = req.user;
  try {
    const order = await Order.create({
      shippingInfo,
      orderItems,
      totalPrice,
      totalPriceAfterDiscount,
      paymentInfo,
      user: _id,
    });
    res.json({
      order,
      success: true,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getMyOrders = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const orders = await Order.find({ user: _id })
      .populate("user")
      .populate("orderItems.product")
      .populate("orderItems.color");
    res.json({
      orders,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getMonthWiseOrderIncome = asyncHandler(async (req, res) => {
  let monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let d = new Date();
  let endDate = "";
  d.setDate(1);
  for (let index = 0; index < 11; index++) {
    d.setMonth(d.getMonth() - 1);
    endDate = monthNames[d.getMonth()] + " " + d.getFullYear();
  }
  const data = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $lte: new Date(),
          $gte: new Date(endDate),
        },
      },
    },
    {
      $group: {
        _id: {
          month: "$month",
        },
        amount: {
          $sum: "$totalPriceAfterDiscount",
        },
      },
    },
  ]);
  res.json(data);
});

const getMonthWiseOrderCount = asyncHandler(async (req, res) => {
  let monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let d = new Date();
  let endDate = "";
  d.setDate(1);
  for (let index = 0; index < 11; index++) {
    d.setMonth(d.getMonth() - 1);
    endDate = monthNames[d.getMonth()] + " " + d.getFullYear();
  }
  const data = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $lte: new Date(),
          $gte: new Date(endDate),
        },
      },
    },
    {
      $group: {
        _id: {
          month: "$month",
        },
        count: {
          $sum: 1,
        },
      },
    },
  ]);
  res.json(data);
});

const getYearlyTotalOrders = asyncHandler(async (req, res) => {
  let monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let d = new Date();
  let endDate = "";
  d.setDate(1);
  for (let index = 0; index < 11; index++) {
    d.setMonth(d.getMonth() - 1);
    endDate = monthNames[d.getMonth()] + " " + d.getFullYear();
  }
  const data = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $lte: new Date(),
          $gte: new Date(endDate),
        },
      },
    },
    {
      $group: {
        _id: null,
        count: {
          $sum: 1,
        },
        amount: {
          $sum: "$totalPriceAfterDiscount",
        },
      },
    },
  ]);
  res.json(data);
});
/* ba9i front ta3 dashboard men 16:28 vers 55:57*/

const getAllOrders = asyncHandler(async (req, res) => {
  // const { _id } = req.user;
  // validateMongodbID(_id);
  try {
    const alluserorders = await Order.find()
      .populate("products.product orderby")
      .exec();
    res.json(alluserorders);
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createUser,
  loginUser,
  getallUser,
  getUser,
  deleteUser,
  updateUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  loginAdmin,
  getWishlist,
  saveAddress,
  userCart,
  getUserCart,
  /* emptyCart,
     applyCoupon,
     createOrder,
     getOrders,
     updateOrderStatus,
     getAllOrders,
     getOrderByUserId, */
  removeProductFromCart,
  updateProductQuantityFromCart,
  createOrder,
  getMyOrders,
  getMonthWiseOrderIncome,
  getMonthWiseOrderCount,
  getYearlyTotalOrders,
  getAllOrders,
  Ajouteruserdroite,
};
/* const userCart = asyncHandler(async (req, res, next)=>{
    const { cart } = req.body;
    const {_id} = req.user;
    validateMongodbID(_id);
    try {
        let products = [];
        const user = await User.findById(_id);
        //check if user already have product in cart
        const alreadyExistCart = await Cart.findOne({orderby: user._id});
        if(alreadyExistCart){
            alreadyExistCart.remove();
        }
        for(let i=0; i< cart.length; i++){
            let object = {};
            object.product = cart[i]._id;
            object.count = cart[i].count;
            object.color = cart[i].color;
            let getprice = await Product.findById(cart[i]._id).select("price").exec();
            object.price = getprice.price;
            products.push(object);
        }
        let cartTotal = 0;
        for(let i=0;i< products.length; i++){
            cartTotal = cartTotal + products[i].price * products[i].count;
        }
        // console.log(products , cartTotal); 
        let newCart = await new Cart({
            products,
            cartTotal,
            orderby: user?._id,
        }).save();
         res.json(newCart); 
        // console.log(newCart) 
    } catch (error) {
        throw new Error(error);
    }
}); 
const emptyCart = asyncHandler(async (req, res)=> {
    const { _id } = req.user;
    validateMongodbID(_id);
    try {
        const user = await User.findOne({_id});
        const cart = await  Cart.findOneAndRemove({orderby: user._id});
        res.json(cart);
    } catch (error) {
        throw new Error(error);
    }
});

const applyCoupon = asyncHandler (async (req, res) => {
    const {coupon} = req.body;
    const {_id} = req.user;
    validateMongodbID(_id);
    try {
        const validCoupon = await  Coupon.findOne({ name:coupon});
        if(validCoupon === null){
            throw new Error("Coupon not found");
        }
        const user = await User.findOne({_id});
        let {cartTotal} = await Cart.findOne({
            orderby: user._id,
        }).populate("products.product");
        let totalAfterDiscount = (cartTotal - (cartTotal * validCoupon.discount)/100).toFixed(2);
        await Cart.findOneAndUpdate(
            {orderby: user._id},
            {totalAfterDiscount},
            {new:true},
            );
            res.json(totalAfterDiscount)
    } catch (error) {
        throw new Error(error);
    }
});

const createOrder = asyncHandler(async (req, res) =>{
    const { COD , couponApplied} = req.body;
    const{_id} = req.user;
    validateMongodbID(_id);
    try {
        if(!COD)throw new Error("Create cash order failed");
        const user = await User.findById(_id);
        let userCart = await Cart.findOne({ orderby: user._id});
        let finalAmout=0;
        if(couponApplied && userCart.totalAfterDiscount){
            finalAmout = userCart.totalAfterDiscount;
        }else{
            finalAmout = userCart.cartTotal ;
        }
        let newOrder = await new Order({
            products: userCart.products,
            payementIntent:{
                id: uniqid(),
                method:"COD",
                amount: finalAmout,
                status:"Cash on Delivery",
                created: Date.now(),
                currency:"usd",
            },
            orderby: user._id,
            orderStatus: "Cash on Delivery",
        }).save();
        let update = userCart.products.map((item) =>{
            return {
                updateOne:{
                    filter:{ _id: item.product._id},
                    update:{$inc:{ quantity: -item.count , sold: +item.count}},
                },
            };
        });
        const updated = await Product.bulkWrite(update, {});
        res.json({message:"created success"});
    } catch (error) {
        throw new Error(error);
    }
});

const getOrders = asyncHandler(async (req,res) =>{
    const { _id } = req.user;
    validateMongodbID(_id);
    try {
        const userorders = await Order.findOne({orderby: _id})
        .populate("products.product").populate("orderby").exec();
        res.json(userorders);
    } catch (error) {
        throw new Error(error)
    }
});


const getAllOrders = asyncHandler(async (req,res) =>{
    try {
        const alluserorders = await Order.find()
        .populate("products.product orderby").exec();
        res.json(alluserorders);
    } catch (error) {
        throw new Error(error)
    }
});
const getOrderByUserId = asyncHandler(async (req,res) =>{
    const { id } = req.params;
    validateMongodbID(id);
    try {
        const userorders = await Order.findOne({orderby: id})
        .populate("products.product").populate("orderby").exec();
        res.json(userorders);
    } catch (error) {
        throw new Error(error)
    }
});

const updateOrderStatus = asyncHandler(async(req, res) =>{
    const { status } = req.body;
    const{id}= req.params;
    validateMongodbID(id);
    try {
        const updateOrderStatus = await Order.findByIdAndUpdate(id,
            {
                orderStatus:status,
                payementIntent:{
                    status:status,
                },
            },
            {new:true});
            res.json(updateOrderStatus);
    } catch (error) {
        throw new Error(error)
    }
}) */
