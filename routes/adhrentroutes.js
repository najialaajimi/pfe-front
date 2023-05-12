const adhrentctrl = require("../controller/adherentCtrl");
const router = require("express").Router();

router.post("/adherent", adhrentctrl.AjouterAdhrent);
router.put("/adherent/:id", adhrentctrl.ajouteradherentdroite);
router.put("/adherent_gauche/:id", adhrentctrl.ajouteradherentgauche);
router.get('/adherent',adhrentctrl.getAllAdhrent)
module.exports = router;
