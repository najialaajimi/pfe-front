const express = require("express");
const router = express.Router();
const {
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
} = require("../controller/userCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { checkout, paymentVerification } = require("../controller/paymentCtrl");

router.post("/register", createUser);
router.put("/password", authMiddleware, updatePassword);
router.get("/wishlist", authMiddleware, getWishlist);
router.get("/cart", authMiddleware, getUserCart);
router.get("/getMonthWiseOrderIncome", authMiddleware, getMonthWiseOrderIncome);
router.get("/getMonthWiseOrderCount", authMiddleware, getMonthWiseOrderCount);
router.get("/getYearlyTotalOrders", authMiddleware, getYearlyTotalOrders);
router.post("/forgot", forgotPasswordToken);
router.put("/reset/:token", resetPassword);
router.post("/loginuser", loginUser);
router.post("/admin-login", loginAdmin);
router.post("/cart", authMiddleware, userCart);
router.post("/order/checkout", authMiddleware, checkout);
router.post("/order/paymentVerification", authMiddleware, paymentVerification);
router.get("/getallUser", getallUser);
router.get("/getmyorders", authMiddleware, getMyOrders);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);
router.get("/:id", authMiddleware, isAdmin, getUser);
router.delete("/deletecart/:cartItemId", authMiddleware, removeProductFromCart);
router.delete(
  "/updatecart/:cartItemId/:newQuantity",
  authMiddleware,
  updateProductQuantityFromCart
);
router.put("/update_user", authMiddleware, updateUser);
router.put("/saveaddress", authMiddleware, saveAddress);
router.put("/blockuser/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblockuser/:id", authMiddleware, isAdmin, unblockUser);
router.post("/cart/create-order", authMiddleware, createOrder);
router.get("/getallorder", authMiddleware, isAdmin, getAllOrders);
router.put("/ajouter_user", authMiddleware, Ajouteruserdroite);
/* 
router.post("/cart/applycoupon", authMiddleware, applyCoupon);
router.post("/cart/cashorder", authMiddleware, createOrder);
router.get("/getorder", authMiddleware, getOrders);
router.get("/getallorder", authMiddleware, isAdmin, getAllOrders);
router.post("/getorderbyuser/:id", authMiddleware, isAdmin, getOrderByUserId);
router.delete("/emptycart", authMiddleware, emptyCart);
router.put("/orderstatus/:id", authMiddleware, isAdmin, updateOrderStatus);
 */

module.exports = router;
