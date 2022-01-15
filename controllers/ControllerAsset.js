
// import { management} from "../api/ControllerBranch/index.js";
import { management } from "../api/ControllerAsset/index.js";

function createControllerAsset(app) {
    management(app)
    // update(app)
    // insert(app)
}
export default createControllerAsset