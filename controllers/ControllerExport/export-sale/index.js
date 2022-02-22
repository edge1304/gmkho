
import * as add from "./../../../api/ControllerExport/export-sale/add.js";
import {management,update } from "./../../../api/ControllerExport/export-sale/index.js";

function createControllerExportSale(app) {
    add.checkPermission(app)
    add.checkPermissionMore(app)
    add.insert(app)
    add.insertMore(app)
    management(app)
    update(app)

}
export default createControllerExportSale