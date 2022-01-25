
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

export const asset = async (req, res) => {
    // console.log("🚀 ~ file: ControllerAdmin.js ~ line 43 ~ asset ~ req", req)
    return res.render("SystemsManagement/Asset/index", { ...header_url(req) })
}

export const category = async (req, res) => {
    var id_super_category = "";
    if (req.query.id_super_category) {
        id_super_category = sanitize(req.query.id_super_category)
    }
    return res.render("SystemsManagement/Category/index", { ...header_url(req), id_super_category: id_super_category })
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
export const up_subcategory = async (req, res) => {
    const id_subcategory = req.query.id_subcategory

    var id_category = req.query.id_category
    if (!validator.isDefine(id_category)) id_category = ""

    var subcategory_status = req.query.subcategory_status
    if (!validator.isDefine(subcategory_status)) subcategory_status = ""
    if(!validator.ObjectId.isValid(id_subcategory)) {
        return res.render("ContentsManagement/SubCategory/index",{...header_url(req),id_category:id_category, subcategory_status:subcategory_status})
    }
    return res.render("ContentsManagement/SubCategory/uptowebsite", {id_subcategory:id_subcategory })
}

export const timekeeping_work = async (req,res)=>{
    let fromdate = validator.timeString().fulldate;
   
    if(validator.isDefine(req.query.fromdate))
    {
        fromdate = req.query.fromdate;
    }
    return res.render("ReportsManagement/Timekeeping/work",{fromdate:fromdate})
}
export const timekeeping_schedule = async (req,res)=>{
    let fromdate = validator.timeString().fulldate;
   
    if(validator.isDefine(req.query.fromdate) && req.query.fromdate.length > 0)
    {
        fromdate = req.query.fromdate;
    }
    return res.render("ReportsManagement/Timekeeping/schedule",{fromdate:fromdate})
}
export const calendar = async (req,res)=>{
    let fromdate = validator.timeString().fulldate;
    if(validator.isDefine(req.query.fromdate))
    {
        fromdate = req.query.fromdate;
    }
    return res.render("ReportsManagement/Calendar/index",{fromdate:fromdate})
}


export const import_supplier = async (req,res)=>{
   
    return res.render("BusinessManagement/ImportProduct/Import-Supplier/index")
}
export const add_import_supplier = async (req,res)=>{
   
    return res.render("BusinessManagement/ImportProduct/Import-Supplier/add")
}

export const fundbook = async (req,res)=>{
   
    return res.render("ReportsManagement/FundBook/index")
}
export const fundbook_report = async (req,res)=>{
   
    return res.render("ReportsManagement/FundBook/report")
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