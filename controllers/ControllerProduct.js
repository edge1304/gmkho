
import { getInfo, history, filter,checkPermission_filter, report_sold_by_date} from "../api/ControllerProduct/index.js";

function createControllerProduct(app) {
    getInfo(app)
    history(app)
    filter(app)
    checkPermission_filter(app)
    report_sold_by_date(app)

}
export default createControllerProduct