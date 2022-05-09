
import * as client from "../api/ControllerOrder/client.js";
import * as admin from "../api/ControllerOrder/admin.js";


function createControllerWarehouse(app) {
    client.tracking(app)
    client.insert(app)
    client.cancel(app)
    admin.management(app)
    admin.checkPermissionExport(app)
    admin.confirmExport(app)
    admin.updateStatus(app)
    admin.insert(app)

}
export default createControllerWarehouse