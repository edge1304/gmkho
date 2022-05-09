
import * as add from "./../../../api/ControllerExport/export-sale/add.js";
import {management,update , revenue_product_checkpermission, revenue_product, print} from "./../../../api/ControllerExport/export-sale/index.js";

function createControllerExportSale(app) {
    add.checkPermission(app)
    add.checkPermissionMore(app)
    add.insert(app)
    add.insertMore(app)
    management(app)
    update(app)
    revenue_product_checkpermission(app)
    revenue_product(app)
    print(app)
}
export default createControllerExportSale