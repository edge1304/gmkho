
import { login } from "../api/ControllerAdmin/login.js";
import {ModelBranch} from './../models/Branch.js'
import * as helper from '../helper/helper.js'
import * as validator from '../helper/validator.js'

function createControllerAdmin(app) {
    login(app);
}

export const home = async (req,res)=>{
    res.render("index")
}
export const loginAdmin = async (req,res)=>{

    const branches = await ModelBranch.find();
    return res.render("Admin/login",{branches:branches})
}

export const employee_management = async (req,res)=>{
    return res.render("Employee/index")
}

export const permission = async (req,res)=>{
    return res.render("Permission/index")
}
export default createControllerAdmin;