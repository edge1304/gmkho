
import { management , insert , update , getUser} from "../api/ControllerUser/index.js";


function createControllerUser(app) {
    management(app)
    insert(app)
    update(app)
    getUser(app)
}
export default createControllerUser