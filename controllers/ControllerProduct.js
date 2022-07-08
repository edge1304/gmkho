
import { getInfo, history, filter,checkPermission_filter, report_sold_by_date, check_warranty} from "../api/ControllerProduct/index.js";

function createControllerProduct(app) {
    getInfo(app)
    history(app)
    filter(app)
    checkPermission_filter(app)
    report_sold_by_date(app)
    check_warranty(app)

}
export default createControllerProduct