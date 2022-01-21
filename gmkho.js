
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
import admin from 'firebase-admin';
import cron from 'node-cron';

const app = express();

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" ,parameterLimit : 10000}));
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

import createControllerEmployee from "./controllers/ControllerEmployee.js";
createControllerEmployee(app);

import createControllerBranch from "./controllers/ControllerBranch.js";
createControllerBranch(app);

import createControllerWarehouse from "./controllers/ControllerWarehouse.js";
createControllerWarehouse(app);

import createControllerCategory from "./controllers/ControllerCategory.js";
createControllerCategory(app);

import createControllerSuperCategory from "./controllers/ControllerSuperCategory.js";
createControllerSuperCategory(app);

import createControllerAsset from "./controllers/ControllerAsset.js";
createControllerAsset(app);

import createControllerSubCategory from "./controllers/ControllerSubCategory.js";
createControllerSubCategory(app);

import createControllerCombo from "./controllers/ControllerCombo.js";
createControllerCombo(app);
createControllerBranch(app)
import createControllerTimekeeping from "./controllers/ControllerTimekeeping.js";
createControllerTimekeeping(app)

import createControllerCalendar from "./controllers/ControllerCalendar.js";
createControllerCalendar(app)

import createControllerMenu from "./controllers/ControllerMenu.js";
createControllerMenu(app)

app.use(routerAdmin);



import { ModelBranch } from "./models/Branch.js"
app.get("/addbranch/:name/:phone", async (req, res) => {
    const data = await new ModelBranch({
        branch_name: req.params.name,
        branch_phone: req.params.phone
    }).save()
    return res.json(data)
})

import { ModelEmployeeGroup } from "./models/EmployeeGroup.js"
app.get("/addGroup/:name/:level/:idgroupsup", async (req, res) => {
    const data = await new ModelEmployeeGroup({
        employee_group_name: req.params.name,
        employee_level: req.params.level,
        id_super_group: req.params.idgroupsup
    }).save()
    return res.json(data)
})

import { ModelFunction } from "./models/Function.js"
app.get("/addFunction/:name", async (req, res) => {
    const data = await new ModelFunction({
        function_name: req.params.name,
    }).save()
    return res.json(data)
})


import { ModelEmployeeSuperGroup } from "./models/EmployeeSuperGroup.js"
app.get("/addSupperGroup/:name/:level", async (req, res) => {
    const data = await new ModelEmployeeSuperGroup({
        employee_super_group_name: req.params.name,
        employee_super_group_level: req.params.level
    }).save()
    return res.json(data)
})

import { ModelSuperCategory } from './models/SuperCategory.js'
import { ModelCategory } from './models/Category.js'
import { ModelWarehouse } from "./models/Warehouse.js"
import { ModelSubCategory } from "./models/SubCategory.js"
import { ModelEmployee } from "./models/Employee.js"
import { ModelAsset } from "./models/Asset.js"
import { ModelWarrantyCombo } from "./models/WarrantyCombo.js"
import { ModelMenu } from "./models/Menu.js"

app.get("/lay:name", async (req, res) => {
    var db = ModelBranch;
    if (req.params.name == "Function")
        db = ModelFunction
    if (req.params.name == "Permission")
        db = ModelPermission
    if (req.params.name == "EmployeeGroup")
        db = ModelEmployeeGroup
    if (req.params.name == "Employee")
        db = ModelEmployee
    if (req.params.name == "EmployeeSuperGroup")
        db = ModelEmployeeSuperGroup
    if (req.params.name == "SuperCategory")
        db = ModelSuperCategory
    if (req.params.name == "Category")
        db = ModelCategory
    if (req.params.name == "Warehouse")
        db = ModelWarehouse
    if (req.params.name == "SubCategory")
        db = ModelSubCategory
    if (req.params.name == "Asset")
        db = ModelAsset 
    if (req.params.name == "WarrantyCombo")
        db = ModelWarrantyCombo  
    if (req.params.name == "Menu")
        db = ModelMenu  

    const data = await db.find().sort({ _id: -1 });
    return res.json(data)
})

app.get("/empty/:name", async (req, res) => {
    var db = ModelBranch;
    if (req.params.name == "Function")
        db = ModelFunction
    if (req.params.name == "Permission")
        db = ModelPermission
    if (req.params.name == "EmployeeGroup")
        db = ModelEmployeeGroup
    if (req.params.name == "Employee")
        db = ModelEmployee
    if (req.params.name == "EmployeeSuperGroup")
        db = ModelEmployeeSuperGroup
    if (req.params.name == "Warehouse")
        db = ModelWarehouse
    if (req.params.name == "SubCategory")
        db = ModelSubCategory
    if (req.params.name == "Asset")
        db = ModelAsset
    const data = await db.deleteMany({})
    return res.json(data)
})
import { ModelPermission } from "./models/Permission.js"
app.get("/addPermission/:group/:function", async (req, res) => {
    const data = await new ModelPermission({
        id_employee_group: req.params.group,
        id_function: req.params.function,
    }).save()
    return res.json(data)
})


app.get("/addEmployee/1", async (req, res) => {
    const data = await new ModelEmployee({
        employee_fullname: "Phạm Văn Vụ",
        employee_phone: "0356388433",
        employee_datebirth: new Date(),
        employee_image: null,
        employee_address: "Hoàng lâu - hồng phong - an dương",
        id_branch: "61e15300a4665e6a0db700e8",
        password: "4dff4ea340f0a823f15d3f4f01ab62eae0e5da579ccb851f8db9dfe84c58b2b37b89903a740e1ee172da793a6e79d560e5f7f9bd058a12a280433ed6fa46510a",
        employee_salary: 10000,
        employee_salary_duty: 5000,
        employee_status: true, // trạng thái của nhân viên : 0: đang 
        employee_bank_number: "102872722091",
        employee_bank_name: "Vietinbank",
        id_employee_group: "61e156a67dc2ff811e02ccb1",
        employee_history_work: [],
        employee_history_salary: [],
        employee_lunch_allowance: 0,
        employee_revenue_percent: 0,
        employee_level: "đẠI HỌC"
    }).save()
    return res.json(data)
})

app.get("/ABC", async (req, res) => {
    
    // // const newData = await new ModelMenu({
    // //     menu_name:"Menu danh mục website",
    // //     menu_content:[
    // //         "61ea21d9ccd4a03c0d639a62",
    // //         "61ea0f2afa61600ddfedbeab",
    // //         "61ea0f20fa61600ddfedbea3",
    // //         "61ea0f13fa61600ddfedbe9b",
    // //     ],
    // //     menu_type:"Category"
    // // }).save()
    // return res.json(newData)
})

app.get("/*", async (req, res) => {
    return res.render('pages/samples/error-404')
})
