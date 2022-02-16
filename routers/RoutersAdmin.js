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
routerAdmin.get("/subcategory-contents-management", router.up_subcategory);
routerAdmin.get("/warranty-combo-management", router.warranty_combo);
routerAdmin.get("/promotion-combo-management", router.promotion_combo);
routerAdmin.get("/asset-management", router.asset);
routerAdmin.get("/user-management", router.user);
routerAdmin.get("/timekeeping-work-management", router.timekeeping_work);
routerAdmin.get("/timekeeping-schedule-management", router.timekeeping_schedule);
routerAdmin.get("/calendar-management", router.calendar);
routerAdmin.get("/menu-management", router.menu);
routerAdmin.get("/import-product-from-supplier/find", router.import_supplier);
routerAdmin.get("/import-product-from-supplier/print", router.print_import_supplier);
routerAdmin.get("/import-product-from-supplier/add", router.add_import_supplier);
routerAdmin.get("/import-product-from-supplier/add/:id_import", router.more_import_supplier);
routerAdmin.get("/import-product-from-period/add/:id_import", router.more_import_period);
routerAdmin.get("/import-product-from-period/add", router.add_import_period);
routerAdmin.get("/import-product-from-period/find", router.import_period);


routerAdmin.get("/fundbook-management", router.fundbook);
routerAdmin.get("/fundbook-management/report", router.fundbook_report);
routerAdmin.get("/accouting-entry-management", router.accounting_entry);

export default routerAdmin;
