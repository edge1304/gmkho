
import { management , insert , update , report_payment_and_receipts} from "../api/ControllerPayment/index.js";


function createControllerPayment(app) {
    management(app)
    insert(app)
    update(app)
    report_payment_and_receipts(app)

}
export default createControllerPayment