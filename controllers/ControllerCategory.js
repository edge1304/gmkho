import { management , insert, update , addKey , updateKey,deleteKey , getDataClient} from "../api/ControllerCategory/index.js";

function createControllerCategory(app) {
    management(app)
    insert(app)
    update(app)
    addKey(app)
    updateKey(app)
    deleteKey(app)
    getDataClient(app)
}
export default createControllerCategory