import { management,update, insert} from '../api/ControllerFundBook/index.js'

function createControllerFundBook(app) {

    management(app)
    update(app)
    insert(app)
}

export default createControllerFundBook;