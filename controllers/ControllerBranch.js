
import { management , update , insert , getByClient} from "../api/ControllerBranch/index.js";

function createControllerBranch(app) {
    management(app)
    update(app)
    insert(app)
    getByClient(app)
}
export default createControllerBranch