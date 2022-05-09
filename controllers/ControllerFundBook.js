import { management,update, insert , report, import_period} from '../api/ControllerFundBook/index.js'

function createControllerFundBook(app) {

    management(app)
    update(app)
    insert(app)
    report(app)
    import_period(app)
}

export default createControllerFundBook;