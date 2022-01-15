
// import { management} from "../api/ControllerBranch/index.js";
import { management , update , insert} from "../api/ControllerBranch/index.js";

function createControllerBranch(app) {
    management(app)
    update(app)
    insert(app)
}
export default createControllerBranch