
import { management} from "../api/ControllerWebsite-Component/website-component-admin.js";
import * as helper from '../helper/helper.js'
import * as validator from '../helper/validator.js'

function controller_website_component(app) {
    management(app)
}
export default controller_website_component