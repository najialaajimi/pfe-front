const Roles = require("../models/roleModel");

const roleCtrl = {
  ajouterRole: async (req, res) => {
    try {
      const { libelle } = req.body;
      const role = await Roles.findOne({ libelle });
      if (role) return res.status(400).json({ msg: " role déja existe" });
      const newRole = new Roles({ libelle });
      await newRole.save();
      res.json({ result: newRole });
    } catch (error) {
      //throw new Error(error);
      return res.status(500).json({ msg: error.message });
    }
  },
  getRoleByid: async (req, res) => {
    try {
      const role = await Roles.findById({ _id: req.params.id });
      res.json({ result: role });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getAllRole: async (req, res) => {
    try {
      const roles = await Roles.find();
      res.json({ result: roles });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updateRole: async (req, res) => {
    try {
      const { libelle } = req.body;
      const newrole = await Roles.findByIdAndUpdate(
        { _id: req.params.id },
        { libelle }
      );
      res.json({ result: newrole });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};
module.exports = roleCtrl;
