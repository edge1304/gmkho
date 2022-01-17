import express from "express";
const routerAdmin = express.Router();
import * as router from "./../controllers/ControllerAdmin.js";

routerAdmin.get("/", router.home);
routerAdmin.get("/login", router.loginAdmin);
routerAdmin.get("/employee-management", router.employee_management);
routerAdmin.get("/permission-management", router.permission);
routerAdmin.get("/branch-management", router.branch);
routerAdmin.get("/warehouse-management", router.warehouse);
routerAdmin.get("/category-management", router.category);
routerAdmin.get("/product-management", router.subcategory);
routerAdmin.get("/asset-management", router.asset);


export default routerAdmin;
