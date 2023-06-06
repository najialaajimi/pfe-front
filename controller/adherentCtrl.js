const Adherents = require("../models/adhrentmodel");

const AdherentCtrl = {
  AjouterAdhrent: async (req, res) => {
    try {
      const { firstname, email, mdp ,gender} = req.body;
 /*      let r = (Math.random() + 1).toString(36).substring(7); */
      // const bureau = [
      //   {
      //     bureau1: {
      //       nom: "b001",
       
      //       childrenR: [],
      //       childrenL: [],
      //     },
      //   },
      // ];
      const adherent = await Adherents.findOne({ email });
      if (adherent) return res.status(400).json({ msg: " adherent existe" });
      const newadh = new Adherents({
        firstname,
        email,
        mdp,
        gender
    
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
      //const element = adherent.bureau.map((e) => e.bureau1);
      if (adherent.childrenR.length === 0) {
        adherent.childrenR.push(userid);
    
        const newAdherent = await Adherents.findByIdAndUpdate(
          { _id: req.params.id },
          { childrenR: adherent.childrenR }
        );
        res.json(newAdherent);
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
      //const element = adherent.bureau.map((e) => e.bureau1);
      if (adherent.childrenL.length === 0) {
        adherent.childrenL.push(userid);

        const newAdherent = await Adherents.findByIdAndUpdate(
          { _id: req.params.id },
          { childrenL: adherent.childrenL }
        );
        res.json(newAdherent);
      } 
     
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  getAdherentById:async(req,res)=>{
    try {
      const adherent=await Adherents.findById({_id:req.params.id}).populate("childrenR").populate("childrenL")
      res.json(adherent)
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  }
};

module.exports = AdherentCtrl;
