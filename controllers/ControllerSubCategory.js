import { management , insert} from "../api/ControllerSubCategory/index.js";

function createControllerSubCategory(app) {
    management(app)
    insert(app)
}
export default createControllerSubCategory