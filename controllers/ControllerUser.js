
import { management, insert, update, getUser, signup, signin, insertMany } from "../api/ControllerUser/index.js";


function createControllerUser(app) {
    management(app)
    insert(app)
    update(app)
    getUser(app)
    signup(app)
    signin(app)
    insertMany(app)
}
export default createControllerUser