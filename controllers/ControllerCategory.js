import { management , insert, update} from "../api/ControllerCategory/index.js";

function createControllerCategory(app) {
    management(app)
    insert(app)
    update(app)
}
export default createControllerCategory