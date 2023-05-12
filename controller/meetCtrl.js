const Meeting = require("../models/meetModel");
const User =  require('../models/userModel');
const asyncHandler = require("express-async-handler");
const { validateMongodbID } = require("../utils/validateMongodbid");
  
const createmeet = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongodbID(_id);
    try {
      const newmeet = await Meeting.create({ ...req.body, userId: _id });
      res.json(newmeet);
    } catch (error) {
      throw new Error(error);
    }
  });
  const getAllMeet = asyncHandler ( async (req, res) => {
    const { _id } = req.user;
      validateMongodbID(_id);
    try {
        const allMeet = await Meeting.find().populate("userId");
        res.json(allMeet);
    } catch (error) {
        throw new Error(error);
    }
  });

  const getMeet = asyncHandler ( async (req, res) => {
    const { id } = req.params;
    validateMongodbID(id);
    try {
        const AMeet = await Meeting.findById(id).populate("userId");
        res.json(AMeet);
    } catch (error) {
        throw new Error(error);
    }
  });
  module.exports = {
    createmeet,
    getAllMeet,
    getMeet
  }