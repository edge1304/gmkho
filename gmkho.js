
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import logger from "morgan";
import * as connectDB from "./connectDB.js";
import routerAdmin from "./routers/RoutersAdmin.js";
import moment from 'moment-timezone';

const app = express();

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors());
app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(logger("dev"));

app.listen(process.env.PORT || 8005, () => {
    console.log(`Server is running with port ${process.env.PORT || 8005} `);
});

import createControllerAdmin from "./controllers/ControllerAdmin.js";
createControllerAdmin(app);
import createControllerPermission from "./controllers/ControllerPermission.js";
createControllerPermission(app);

app.use(routerAdmin);















import {ModelBranch} from "./models/Branch.js"
app.get("/addbranch/:name/:phone",async (req,res)=>
{
    const data =  await new ModelBranch({
        branch_name: req.params.name,
        branch_phone:req.params.phone
    }).save()
    return res.json(data)
})

import {ModelEmployeeGroup} from "./models/EmployeeGroup.js"
app.get("/addGroup/:name/:level/:idgroupsup",async (req,res)=>
{
    const data =  await new ModelEmployeeGroup({
        employee_group_name: req.params.name,
        employee_level:req.params.level,
        id_super_group: req.params.idgroupsup
    }).save()
    return res.json(data)
})

import {ModelFunction} from "./models/Function.js"
app.get("/addFunction/:name",async (req,res)=>
{
    const data =  await new ModelFunction({
        function_name: req.params.name,
    }).save()
    return res.json(data)
})


import {ModelEmployeeSuperGroup} from "./models/EmployeeSuperGroup.js"
app.get("/addSupperGroup/:name",async (req,res)=>
{
    const data =  await new ModelEmployeeSuperGroup({
        employee_super_group_name: req.params.name,
    }).save()
    return res.json(data)
})

app.get("/lay:name",async (req,res)=>
{
    var db = ModelBranch;
    if(req.params.name == "Function")
        db= ModelFunction
    if(req.params.name == "Permission")
        db= ModelPermission
    if(req.params.name == "EmployeeGroup")
        db= ModelEmployeeGroup
    if(req.params.name == "Employee")
        db= ModelEmployee
    if(req.params.name == "EmployeeSuperGroup")
        db= ModelEmployeeSuperGroup

    const data =  await db.find().sort({_id:-1});
    return res.json(data)
})

import {ModelPermission} from "./models/Permission.js"
app.get("/addPermission/:group/:function",async (req,res)=>
{
    const data =  await new ModelPermission({
        id_employee_group: req.params.group,
        id_function: req.params.function,
    }).save()
    return res.json(data)
})


import {ModelEmployee} from "./models/Employee.js"
app.get("/addEmployee/1",async (req,res)=>
{
    const data =  await new ModelEmployee({
        employee_fullname: "Phạm Văn Vụ",
        employee_phone: "0356388433",
        employee_datebirth: new Date(),
        employee_image:null,
        employee_address:"Hoàng lâu - hồng phong - an dương",
        id_branch:"61d4fca30aa5e9767284923b",
        password:"4dff4ea340f0a823f15d3f4f01ab62eae0e5da579ccb851f8db9dfe84c58b2b37b89903a740e1ee172da793a6e79d560e5f7f9bd058a12a280433ed6fa46510a",
        employee_salary:10000,
        employee_salary_duty:5000,
        employee_status:true, // trạng thái của nhân viên : 0: đang 
        employee_bank_number:"102872722091", 
        employee_bank_name:"Vietinbank",
        id_employee_group:"61d4fd290aa5e97672849246",
        employee_history_work:[],
        employee_history_salary:[],
        employee_lunch_allowance:0,
        employee_revenue_percent:0,
        employee_level:"đẠI HỌC"
    }).save()
    return res.json(data)
})

app.get("/ABC",async (req,res)=>{
    await ModelEmployeeGroup.updateMany({},{$set:{id_super_group:"61d953d7423b3518f5744bb2"}})
    res.send("ok")
})

app.get("/*",async (req,res)=>
{
    return res.render('pages/samples/error-404')
})

