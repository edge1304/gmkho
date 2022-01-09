import express from "express";
const routerAdmin = express.Router();
import * as router from "./../controllers/ControllerAdmin.js";

routerAdmin.get("/", router.home);
routerAdmin.get("/login", router.loginAdmin);
routerAdmin.get("/employee-management", router.employee_management);
routerAdmin.get("/permission-management", router.permission);

export default routerAdmin;
