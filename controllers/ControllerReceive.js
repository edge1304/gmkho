
import { management , insert , update, get_data_print} from "../api/ControllerReceive/index.js";


function createControllerReceive(app) {
    management(app)
    insert(app)
    update(app)
    get_data_print(app)
}
export default createControllerReceive