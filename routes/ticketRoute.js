const express = require("express");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();
const { createTicket, getAllTicket, getTicket, addDescription, openTicket } = require("../controller/ticketControlers");

// Re-route into note router

router.post("/", authMiddleware, createTicket);
router.get("/get",  authMiddleware,  getAllTicket);
router.get("/:id",  authMiddleware,  getTicket);
router.post("/:id/desc", authMiddleware,  addDescription);
router.put('/:id/open', openTicket);

module.exports = router;
