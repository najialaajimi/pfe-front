const express = require("express");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const { createmeet, getAllMeet, getMeet } = require("../controller/meetCtrl");
const router = express.Router();


// Re-route into note router

router.post("/", authMiddleware,isAdmin, createmeet);
router.get("/", authMiddleware, getAllMeet);
router.get("/:id/get", authMiddleware, getMeet); 

module.exports = router;