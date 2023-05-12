const Adherents = require("../models/adhrentmodel");

const AdherentCtrl = {
  AjouterAdhrent: async (req, res) => {
    try {
      const { firstname, email, mdp } = req.body;
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
      const adherent = await Adherents.findOne({ email });
      if (adherent) return res.status(400).json({ msg: " adherent existe" });
      const newadh = new Adherents({
        firstname,

        email,

        mdp,
        bureau: bureau,
      });
      const adh = await newadh.save();
      res.json(adh);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  ajouteradherentdroite: async (req, res) => {
    const { _id } = req.params.id;
    const { userid } = req.body;
    try {
      const adherent = await Adherents.findById({ _id: req.params.id });
      console.log(adherent);
      const element = adherent.bureau.map((e) => e.bureau1);
      if (element[0].linkD.length === 0) {
        element[0].linkD.push(userid);
        element[0].extD = userid;
        const newAdherent = await Adherents.findOneAndUpdate(
          { _id: req.params.id },
          { bureau: adherent.bureau }
        );
        res.json(newAdherent);
      } else {
        const findadherent = await Adherents.findById({ _id: element[0].extD });
        const element2 = findadherent.bureau.map((e) => e.bureau1);
        if (element2[0].linkD.length === 0) {
          element2[0].linkD.push(userid);
          element2[0].extD = userid;

          const newuser2 = await Adherents.findOneAndUpdate(
            { _id: element[0].extD },
            { bureau: findadherent.bureau }
          );
          element[0].extD = element2[0].extD;
          const newuser = await Adherents.findOneAndUpdate(
            { _id: req.params.id },
            { bureau: adherent.bureau }
          );

          await Adherents.updateMany(
            {},
            { $set: { bureau: findadherent.bureau } }
          );
          res.json(adherent);
        } else {
          element2(0).extD = userid;
          const newuser2 = await Adherents.findOneAndUpdate(
            { _id: element[0].extD },
            { bureau: findadherent.bureau }
          );
          element[0].extD = element2[0].extD;
          const newuser = await Adherents.findOneAndUpdate(
            { _id: req.params.id },
            { bureau: adherent.bureau }
          );
          res.json(adherent);
        }
      }
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getAllAdhrent: async (req, res) => {
    const adherents = await Adherents.find();
    res.json(adherents);
  },

  ajouteradherentgauche: async (req, res) => {
    const { _id } = req.params.id;
    const { userid } = req.body;
    try {
      const adherent = await Adherents.findById({ _id: req.params.id });
      console.log(adherent);
      const element = adherent.bureau.map((e) => e.bureau1);
      if (element[0].linkG.length === 0) {
        element[0].linkG.push(userid);
        element[0].extG = userid;
        const newAdherent = await Adherents.findOneAndUpdate(
          { _id: req.params.id },
          { bureau: adherent.bureau }
        );
        res.json(newAdherent);
      } else {
        const findadherent = await Adherents.findById({ _id: element[0].extG });
        const element2 = findadherent.bureau.map((e) => e.bureau1);
        if (element2[0].linkG.length === 0) {
          element2[0].linkG.push(userid);
          element2[0].extG = userid;

          const newuser2 = await Adherents.findOneAndUpdate(
            { _id: element[0].extG },
            { bureau: findadherent.bureau }
          );
          element[0].extG = element2[0].extG;
          const newuser = await Adherents.findOneAndUpdate(
            { _id: req.params.id },
            { bureau: adherent.bureau }
          );

          await Adherents.updateMany(
            {},
            { $set: { bureau: findadherent.bureau } }
          );
          res.json(adherent);
        } else {
          element2(0).extG = userid;
          const newuser2 = await Adherents.findOneAndUpdate(
            { _id: element[0].extG },
            { bureau: findadherent.bureau }
          );
          element[0].extG = element2[0].extG;
          const newuser = await Adherents.findOneAndUpdate(
            { _id: req.params.id },
            { bureau: adherent.bureau }
          );
          res.json(adherent);
        }
      }
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = AdherentCtrl;
