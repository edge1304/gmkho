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
routerAdmin.get("/import-product-from-supplier/import/import-supplier/add/:id_import", router.more_import_supplier);

routerAdmin.get("/import-product-from-period/import/import-period/add/:id_import", router.more_import_period);
routerAdmin.get("/import-product-from-period/add", router.add_import_period);
routerAdmin.get("/import-product-from-period/find", router.import_period);

routerAdmin.get("/import-product-from-return/find", router.import_return);
routerAdmin.get("/import-product-from-return/add", router.add_import_return);
routerAdmin.get("/import-product-from-return/import/import-return/add/:id_import", router.more_import_return);

routerAdmin.get("/export-product-to-sale/find", router.export_sale);
routerAdmin.get("/export-product-to-sale/add", router.add_export_sale);
routerAdmin.get("/export-product-to-sale/add/:id_export", router.more_export_sale);


routerAdmin.get("/export-product-to-return/find", router.export_return);
routerAdmin.get("/export-product-to-return/add", router.add_export_return);
routerAdmin.get("/export-product-to-return/add/:id_export", router.more_export_return);

routerAdmin.get("/point-management", router.point);
routerAdmin.get("/voucher-management", router.voucher);

routerAdmin.get("/fundbook-management", router.fundbook);
routerAdmin.get("/fundbook-management/report", router.fundbook_report);
routerAdmin.get("/accouting-entry-management", router.accounting_entry);

routerAdmin.get("/internal-order-management", router.internal_order);

export default routerAdmin;
