import { login} from '../api/ControllerEmployee/login.js'
import { management,update, insert} from '../api/ControllerEmployee/index.js'

function createControllerEmployee(app) {
    login(app)
    management(app)
    update(app)
    insert(app)
}

export default createControllerEmployee;