const route = require("express").Router();
const roleCtrl = require("../controller/RoleCtlr");

route.get("/role", roleCtrl.getAllRole);
route.post("/role", roleCtrl.ajouterRole);
route.get("/role/:id", roleCtrl.getRoleByid);
route.put("/role/:id", roleCtrl.updateRole);

module.exports = route;
