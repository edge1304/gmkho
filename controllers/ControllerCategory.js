import { management , insert, update , addKey , updateKey,deleteKey , getDataClient , edit_content} from "../api/ControllerCategory/index.js";

function createControllerCategory(app) {
    management(app)
    insert(app)
    update(app)
    addKey(app)
    updateKey(app)
    deleteKey(app)
    getDataClient(app)
    edit_content(app)
}
export default createControllerCategory