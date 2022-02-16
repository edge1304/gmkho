
import * as add from "./../../../api/ControllerImport/import-supplier/add.js";
import {management , update} from "./../../../api/ControllerImport/import-supplier/index.js";

function createControllerImportSupplier(app) {
    add.checkPermission(app)
    add.checkPermissionMore(app)
    add.insert(app)
    add.insertMore(app)
    management(app)
    update(app)
}
export default createControllerImportSupplier