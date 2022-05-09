import { login } from "../api/ControllerAdmin/login.js"
import { ModelBranch } from "./../models/Branch.js"
import * as helper from "../helper/helper.js"
import * as validator from "../helper/validator.js"
import sanitize from "mongo-sanitize"

function createControllerAdmin(app) {
    login(app)
}

export const home = async (req, res) => {
    res.render("index")
}
export const loginAdmin = async (req, res) => {
    const branches = await ModelBranch.find()
    return res.render("Admin/login", { branches: branches })
}

export const employee_management = async (req, res) => {
    var id_employee_group = ""
    if (validator.isDefine(req.query.id_employee_group)) {
        id_employee_group = sanitize(req.query.id_employee_group)
    }

    return res.render("SystemsManagement/Employee/index", { ...header_url(req), id_employee_group: id_employee_group })
}

export const permission = async (req, res) => {
    return res.render("SystemsManagement/Permission/index")
}

export const branch = async (req, res) => {
    return res.render("SystemsManagement/Branch/index")
}

export const warehouse = async (req, res) => {
    return res.render("SystemsManagement/Warehouse/index")
}

export const subcategory = async (req, res) => {
    var id_category = req.query.id_category
    if (!validator.isDefine(id_category)) id_category = ""
    return res.render("SystemsManagement/SubCategory/index", { ...header_url(req), id_category: id_category })
}

export const asset = async (req, res) => res.render("SystemsManagement/Asset/index", { ...header_url(req) })

export const user = async (req, res) => res.render("SystemsManagement/User/index", { ...header_url(req) })

export const category = async (req, res) => {
    var id_super_category = ""
    if (req.query.id_super_category) {
        id_super_category = sanitize(req.query.id_super_category)
    }
    return res.render("SystemsManagement/Category/index", { ...header_url(req), id_super_category: id_super_category })
}
export const accounting_entry = async (req, res) => {
    var type = ""
    if (validator.isDefine(req.query.type) && req.query.type.length > 0) type = req.query.type
    return res.render("SystemsManagement/AccountingEntry/index", { ...header_url(req), type: type })
}
export const warranty_combo = async (req, res) => {
    return res.render("ContentsManagement/Combo/warranty", { ...header_url(req) })
}

export const promotion_combo = async (req, res) => {
    return res.render("ContentsManagement/Combo/promotion", { ...header_url(req) })
}
export const menu = async (req, res) => {
    return res.render("ContentsManagement/Menu/index", { ...header_url(req) })
}
export const website_component = async (req, res) => {
    return res.render("ContentsManagement/Website-Component/website-component", { ...header_url(req) })
}
export const up_subcategory = async (req, res) => {
    const id_subcategory = req.query.id_subcategory

    var id_category = req.query.id_category
    if (!validator.isDefine(id_category)) id_category = ""

    var subcategory_status = req.query.subcategory_status
    if (!validator.isDefine(subcategory_status)) subcategory_status = ""
    if (!validator.ObjectId.isValid(id_subcategory)) {
        return res.render("ContentsManagement/SubCategory/index", { ...header_url(req), id_category: id_category, subcategory_status: subcategory_status })
    }
    return res.render("ContentsManagement/SubCategory/uptowebsite", { id_subcategory: id_subcategory })
}

export const timekeeping_work = async (req, res) => {
    let fromdate = validator.timeString().fulldate

    if (validator.isDefine(req.query.fromdate)) {
        fromdate = req.query.fromdate
    }
    return res.render("ReportsManagement/Timekeeping/work", { fromdate: fromdate })
}
export const timekeeping_schedule = async (req, res) => {
    let fromdate = validator.timeString().fulldate

    if (validator.isDefine(req.query.fromdate) && req.query.fromdate.length > 0) {
        fromdate = req.query.fromdate
    }
    return res.render("ReportsManagement/Timekeeping/schedule", { fromdate: fromdate })
}
export const calendar = async (req, res) => {
    let fromdate = validator.timeString().fulldate

    if (validator.isDefine(req.query.fromdate) && req.query.fromdate.length > 0) {
        fromdate = req.query.fromdate
    }
    return res.render("ReportsManagement/Calendar/index", { fromdate: fromdate })
}

export const import_supplier = async (req, res) => {
    return res.render("BusinessManagement/ImportProduct/Import-Supplier/index", { ...header_url(req) })
}

export const import_period = async (req, res) => {
    return res.render("BusinessManagement/ImportProduct/Import-Period/index", { ...header_url(req) })
}
export const add_import_supplier = async (req, res) => {
    return res.render("BusinessManagement/ImportProduct/Import-Supplier/add")
}

export const print_import_supplier = async (req, res) => {
    return res.render("BusinessManagement/ImportProduct/Import-Supplier/print", { ...header_url(req) })
}

export const add_import_period = async (req, res) => {
    return res.render("BusinessManagement/ImportProduct/Import-Period/add")
}

export const more_import_supplier = async (req, res) => {
    return res.render("BusinessManagement/ImportProduct/Import-Supplier/more", { id_import: req.params.id_import })
}
export const more_import_period = async (req, res) => {
    return res.render("BusinessManagement/ImportProduct/Import-Period/more", { id_import: req.params.id_import })
}
export const fundbook = async (req, res) => {
    return res.render("ReportsManagement/FundBook/index", { ...header_url(req) })
}

export const report_fundbook = async (req, res) => {
    return res.render("ReportsManagement/FundBook/report", { ...header_url(req) })
}

export const export_sale = async (req, res) => {
    return res.render("BusinessManagement/ExportProduct/export-sale/index", { ...header_url(req) })
}
export const add_export_sale = async (req, res) => {
    return res.render("BusinessManagement/ExportProduct/export-sale/add")
}
export const more_export_sale = async (req, res) => {
    return res.render("BusinessManagement/ExportProduct/export-sale/more", { ...header_url(req) })
}

export const export_return = async (req, res) => {
    return res.render("BusinessManagement/ExportProduct/export-return/index", { ...header_url(req) })
}
export const add_export_return = async (req, res) => {
    return res.render("BusinessManagement/ExportProduct/export-return/add")
}
export const more_export_return = async (req, res) => {
    return res.render("BusinessManagement/ExportProduct/export-return/more", { ...header_url(req) })
}

export const point = async (req, res) => {
    return res.render("SystemsManagement/Point/index")
}

export const voucher = async (req, res) => {
    return res.render("SystemsManagement/Voucher/index", { ...header_url(req) })
}

export const import_return = async (req, res) => {
    return res.render("BusinessManagement/ImportProduct/import-return/index", { ...header_url(req) })
}
export const add_import_return = async (req, res) => {
    return res.render("BusinessManagement/ImportProduct/import-return/add")
}
export const more_import_return = async (req, res) => {
    return res.render("BusinessManagement/ImportProduct/import-return/more", { ...header_url(req) })
}

export const internal_order_proposal = async (req, res) => {
    const id_warehouse = req.query.id_warehouse
    return res.render("BusinessManagement/InternalOrder/proposal", { ...header_url(req), id_warehouse: id_warehouse })
}

export const internal_order_proposaled = async (req, res) => {
    const id_warehouse = req.query.id_warehouse
    return res.render("BusinessManagement/InternalOrder/proposaled", { ...header_url(req), id_warehouse: id_warehouse })
}

export const internal_order_export = async (req, res) => {
    const id_internal_order = req.params.id_internal_order
    return res.render("BusinessManagement/InternalOrder/export", { id_internal_order: id_internal_order })
}

export const receive_form = async (req, res) => {
    return res.render("BusinessManagement/Receive/index", { ...header_url(req) })
}
export const payment_form = async (req, res) => {
    return res.render("BusinessManagement/Payment/index", { ...header_url(req) })
}

export const borrow = async (req, res) => {
    const id_warehouse = typeof req.query.id_warehouse == "undefined" ? "" : req.query.id_warehouse
    return res.render("BusinessManagement/Borrow/index", { ...header_url(req), id_warehouse: id_warehouse, borrow_status: req.query.borrow_status })
}

export const order = async (req, res) => {
    return res.render("BusinessManagement/Order/index", { ...header_url(req) })
}

export const order_export = async (req, res) => {
    return res.render("BusinessManagement/Order/export", { ...header_url(req) })
}

export const warranty_management = async (req, res) => {
    return res.render("BusinessManagement/Warranty/index", { ...header_url(req) })
}

export const warranty_export_management = async (req, res) => {
    return res.render("BusinessManagement/Warranty/export", { ...header_url(req) })
}

export const report_debt = async (req, res) => {
    return res.render("ReportsManagement/Debt/index", { ...header_url(req) })
}

export const report_inventory = async (req, res) => {
    return res.render("ReportsManagement/Inventory/index", { ...header_url(req) })
}

export const find_product = async (req, res) => {
    return res.render("FindsManagement/Product/index", { ...header_url(req) })
}

export const filter_product = async (req, res) => {
    return res.render("FindsManagement/Product/filter", { ...header_url(req) })
}

export const payment_and_receive = async (req, res) => {
    return res.render("ReportsManagement/PaymentAndReceive/index", { ...header_url(req) })
}

export const revenue_product = async (req, res) => {
    return res.render("ReportsManagement/RevenueProduct/index", { ...header_url(req) })
}

export const print_export = async (req, res) => {
    return res.render("BusinessManagement/ExportProduct/export_print", { ...header_url(req) })
}
export const print_import = async (req, res) => {
    return res.render("BusinessManagement/ImportProduct/print", { ...header_url(req) })
}
export const print_receive = async (req, res) => {
    return res.render("BusinessManagement/Receive/print", { ...header_url(req) })
}

export const promotion = async (req, res) => {
    return res.render("ContentsManagement/GM-Feed/Promotion/index", { ...header_url(req) })
}

export const edit_add_promotion = async (req, res) => {
    return res.render("ContentsManagement/GM-Feed/Promotion/edit_add_promotion", { ...header_url(req) })
}

export const news = async (req, res) => {
    return res.render("ContentsManagement/GM-Feed/News/index", { ...header_url(req) })
}

export const edit_add_news = async (req, res) => {
    return res.render("ContentsManagement/GM-Feed/News/edit_add_news", { ...header_url(req) })
}
export const product_sold_by_date = async (req, res) => {
    return res.render("ReportsManagement/ProductSoldByDate/index", { ...header_url(req) })
}

export default createControllerAdmin

const header_url = (req) => {
    var page = 1
    var query = { limit: 10, page: 1, key: "", fromdate: validator.timeString().startOfWeek, todate: validator.timeString().fulldate }
    if (validator.isDefine(req.query.limit)) {
        query = { ...query, limit: validator.tryParseInt(req.query.limit) }
    }
    if (validator.isDefine(req.query.page)) {
        page = validator.tryParseInt(req.query.page)
        if (page <= 0) page = 1
        query = { ...query, page: page }
    }

    Object.keys(req.query).map((key) => {
        if (key != "limit" && key != "page")
            if (isNaN(parseInt(req.query[key])) || validator.ObjectId.isValid(req.query[key])) {
                query = { ...query, [key]: req.query[key] }
            } else {
                query = { ...query, [key]: parseInt(req.query[key]) }
            }
    })

    Object.keys(req.params).map((key) => {
        if (key != "limit" && key != "page")
            if (isNaN(parseInt(req.params[key])) || validator.ObjectId.isValid(req.params[key])) {
                query = { ...query, [key]: req.params[key] }
            } else {
                query = { ...query, [key]: parseInt(req.params[key]) }
            }
    })

    if (validator.isDefine(req.query.fromdate)) {
        query = {
            ...query,
            fromdate: req.query.fromdate,
        }
    }

    if (validator.isDefine(req.query.todate)) {
        query = {
            ...query,
            todate: req.query.todate,
        }
    }
    return query
}
