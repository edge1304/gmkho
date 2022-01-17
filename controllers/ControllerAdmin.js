
import { login } from "../api/ControllerAdmin/login.js";
import { ModelBranch } from './../models/Branch.js'
import * as helper from '../helper/helper.js'
import * as validator from '../helper/validator.js'
import sanitize from "mongo-sanitize";

function createControllerAdmin(app) {
    login(app);
}

export const home = async (req, res) => {
    res.render("index")
}
export const loginAdmin = async (req, res) => {

    const branches = await ModelBranch.find();
    return res.render("Admin/login", { branches: branches })
}

export const employee_management = async (req, res) => {
    var id_employee_group = "";
    if (validator.isDefine(req.query.id_employee_group)) {
        id_employee_group = sanitize(req.query.id_employee_group)
    }

    return res.render("Employee/index", { ...header_url(req), id_employee_group: id_employee_group })
}

export const permission = async (req, res) => {
    return res.render("Permission/index")
}

export const branch = async (req, res) => {
    return res.render("Branch/index")
}

export const warehouse = async (req, res) => {
    return res.render("Warehouse/index")
}
export const subcategory = async (req, res) => {
    var id_category = req.query.id_category
    if(!validator.isDefine(id_category)) id_category = ""
    return res.render("SubCategory/index",{...header_url(req),id_category:id_category})
}
export const asset = async (req, res) => {
    console.log("🚀 ~ file: ControllerAdmin.js ~ line 43 ~ asset ~ req", req)
    return res.render("Asset/index", { ...header_url(req) })
}



export const category = async (req, res) => {
    var id_super_category = "";
    if (req.query.id_super_category) {
        id_super_category = sanitize(req.query.id_super_category)
    }
    return res.render("Category/index", { ...header_url(req), id_super_category: id_super_category })
}
export default createControllerAdmin;


const header_url = (req) => {

    var page = 1;
    var query = { limit: 10, page: 1, key: "" }
    if (validator.isDefine(req.query.limit)) {
        query = { ...query, limit: validator.tryParseInt(req.query.limit) }
    }
    if (validator.isDefine(req.query.page)) {
        page = validator.tryParseInt(req.query.page)
        if (page <= 0) page = 1
        query = { ...query, page: page }
    }

    Object.keys(req.query).map(key => {
        if (key != 'limit' && key != 'page')
            if (isNaN(parseInt(req.query[key]))) {
                query = { ...query, [key]: req.query[key] }
            }
            else {
                query = { ...query, [key]: parseInt(req.query[key]) }
            }
    })
    return query
}