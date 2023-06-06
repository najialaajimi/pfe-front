const adhrentctrl = require("../controller/adherentCtrl");
const router = require("express").Router();

router.post("/adherent", adhrentctrl.AjouterAdhrent);
router.put("/adherent_R/:id", adhrentctrl.ajouteradherentdroite);
router.put("/adherent_L/:id", adhrentctrl.ajouteradherentgauche);
router.get('/adherent',adhrentctrl.getAllAdhrent)
router.get('/adherent/:id',adhrentctrl.getAdherentById)
module.exports = router;
