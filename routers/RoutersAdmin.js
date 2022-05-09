import express from "express"
const routerAdmin = express.Router()
import * as router from "./../controllers/ControllerAdmin.js"

routerAdmin.get("/", router.home)
routerAdmin.get("/login", router.loginAdmin)
routerAdmin.get("/employee-management", router.employee_management)
routerAdmin.get("/permission-management", router.permission)
routerAdmin.get("/branch-management", router.branch)
routerAdmin.get("/warehouse-management", router.warehouse)
routerAdmin.get("/category-management", router.category)
routerAdmin.get("/product-management", router.subcategory)
routerAdmin.get("/subcategory-contents-management", router.up_subcategory)
routerAdmin.get("/warranty-combo-management", router.warranty_combo)
routerAdmin.get("/promotion-combo-management", router.promotion_combo)
routerAdmin.get("/asset-management", router.asset)
routerAdmin.get("/user-management", router.user)
routerAdmin.get("/timekeeping-work-management", router.timekeeping_work)
routerAdmin.get("/timekeeping-schedule-management", router.timekeeping_schedule)
routerAdmin.get("/calendar-management", router.calendar)
routerAdmin.get("/menu-management", router.menu)
routerAdmin.get("/component-website-management", router.website_component)

routerAdmin.get("/import-product-from-supplier/find", router.import_supplier)
routerAdmin.get("/import-product-from-supplier/print", router.print_import_supplier)
routerAdmin.get("/import-product-from-supplier/add", router.add_import_supplier)
routerAdmin.get("/import-product-from-supplier/import/import-supplier/add/:id_import", router.more_import_supplier)

routerAdmin.get("/import-product-from-period/import/import-period/add/:id_import", router.more_import_period)
routerAdmin.get("/import-product-from-period/add", router.add_import_period)
routerAdmin.get("/import-product-from-period/find", router.import_period)

routerAdmin.get("/import-product-from-return/find", router.import_return)
routerAdmin.get("/import-product-from-return/add", router.add_import_return)
routerAdmin.get("/import-product-from-return/import/import-return/add/:id_import", router.more_import_return)

routerAdmin.get("/export-product-to-sale/find", router.export_sale)
routerAdmin.get("/export-product-to-sale/add", router.add_export_sale)
routerAdmin.get("/export-product-to-sale/add/:id_export", router.more_export_sale)

routerAdmin.get("/export-product-to-return/find", router.export_return)
routerAdmin.get("/export-product-to-return/add", router.add_export_return)
routerAdmin.get("/export-product-to-return/add/:id_export", router.more_export_return)
routerAdmin.get("/export/print/:id_export", router.print_export)

routerAdmin.get("/point-management", router.point)
routerAdmin.get("/voucher-management", router.voucher)

routerAdmin.get("/fundbook-management", router.fundbook)
routerAdmin.get("/fundbook-management/report", router.report_fundbook)

routerAdmin.get("/accouting-entry-management", router.accounting_entry)

routerAdmin.get("/internal-order-management/proposal", router.internal_order_proposal)
routerAdmin.get("/internal-order-management/proposaled", router.internal_order_proposaled)
routerAdmin.get("/internal-order-management/export/:id_internal_order", router.internal_order_export)

routerAdmin.get("/receive-form-management", router.receive_form)
routerAdmin.get("/payment-form-management", router.payment_form)

routerAdmin.get("/borrow-management", router.borrow)
routerAdmin.get("/order-management", router.order)
routerAdmin.get("/order-management/export/:id_order", router.order_export)
routerAdmin.get("/warranty-management", router.warranty_management)
routerAdmin.get("/warranty-export-management", router.warranty_export_management)
routerAdmin.get("/debt-management", router.report_debt)
routerAdmin.get("/inventory-management", router.report_inventory)
routerAdmin.get("/find-product-history", router.find_product)
routerAdmin.get("/filter-product", router.filter_product)
routerAdmin.get("/revenue-and-expenditure-statistics", router.payment_and_receive)
routerAdmin.get("/revenue-product", router.revenue_product)
routerAdmin.get("/receive/print/:id_receive", router.print_receive)
routerAdmin.get("/import/print/:id_import", router.print_import)
routerAdmin.get("/promotion-news-management", router.promotion)
routerAdmin.get("/promotion-news-management/edit-promotion", router.edit_add_promotion)

routerAdmin.get("/news-management", router.news)
routerAdmin.get("/news-management/edit-news", router.edit_add_news)
routerAdmin.get("/product-sold-by-date", router.product_sold_by_date)

export default routerAdmin
