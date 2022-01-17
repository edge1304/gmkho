import { management , insert, update , addKey , updateKey,deleteKey} from "../api/ControllerCategory/index.js";

function createControllerCategory(app) {
    management(app)
    insert(app)
    update(app)
    addKey(app)
    updateKey(app)
    deleteKey(app)
}
export default createControllerCategory