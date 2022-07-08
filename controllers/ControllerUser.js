
import { management, insert, update, getUser, signup, signin, insertMany ,update_client ,change_password} from "../api/ControllerUser/index.js";


function createControllerUser(app) {
    management(app)
    insert(app)
    update(app)
    getUser(app)
    signup(app)
    signin(app)
    insertMany(app)
    update_client(app)
    change_password(app)
}
export default createControllerUser