const express = require('express');
const { createCoupon, getallCoupon, updateCoupon, deleteCoupon, getCoupon } = require('../controller/couponCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/' ,authMiddleware , isAdmin, createCoupon);
router.get('/', authMiddleware , isAdmin , getallCoupon);
router.get('/:id', authMiddleware , isAdmin , getCoupon);
router.put('/:id' ,authMiddleware , isAdmin, updateCoupon);
router.delete('/:id' ,authMiddleware , isAdmin, deleteCoupon);




module.exports = router;