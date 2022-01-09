
import { management } from "../api/ControllerPermission/index.js";
import * as helper from '../helper/helper.js'
import * as validator from '../helper/validator.js'

function createControllerPermission(app) {
    management(app);
}
export default createControllerPermission