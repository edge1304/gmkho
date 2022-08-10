
import { management, insert, update, getUser, signup, signin, insertMany ,update_client ,change_password , get_history, check_is_register} from "../api/ControllerUser/index.js";


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
    get_history(app)
    check_is_register(app)
}
export default createControllerUser