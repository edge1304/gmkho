
import {management , get_by_id , insert, get_data_client} from "./../../api/ControllerGM-Feed/News/index.js";

function createController_News(app) {

    management(app)
    get_by_id(app)
    insert(app)
    get_data_client(app)
}
export default createController_News