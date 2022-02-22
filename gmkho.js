
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

import * as validator from "./helper/validator.js"
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

import createControllerFundBook from "./controllers/ControllerFundBook.js";
createControllerFundBook(app)

import createControllerAccountingEntry from "./controllers/ControllerAccountingEntry.js";
createControllerAccountingEntry(app)

import createControllerImportSupplier from "./controllers/ControllerImport/import-supplier/index.js";
createControllerImportSupplier(app)

import createControllerImportPeriod from "./controllers/ControllerImport/import-period/index.js";
createControllerImportPeriod(app)

import createControllerImportReturn from "./controllers/ControllerImport/import-return/index.js";
createControllerImportReturn(app)

import createControllerExportSale from "./controllers/ControllerExport/export-sale/index.js";
createControllerExportSale(app)

import createControllerExportReturn from "./controllers/ControllerExport/export-return/index.js";
createControllerExportReturn(app)

import createControllerUser from "./controllers/ControllerUser.js";
createControllerUser(app)

import createControllerPoint from "./controllers/ControllerPoint.js";
createControllerPoint(app)

import createControllerVoucher from "./controllers/ControllerVoucher.js";
createControllerVoucher(app)

import createControllerProduct from "./controllers/ControllerProduct.js";
createControllerProduct(app)



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
import { ModelCalendar } from "./models/Calendar.js"
import { ModelFundBook } from "./models/FundBook.js"
import { ModelAccountingEntry } from "./models/AccountingEntry.js"
import { ModelUser } from "./models/User.js"
import { ModelProduct } from "./models/Product.js"
import { ModelImportForm } from "./models/ImportForm.js"
import { ModelPayment } from "./models/Payment.js"
import { ModelDebt } from "./models/Debt.js"
import { ModelPoint } from "./models/Point.js"
import { ModelVoucher } from "./models/Voucher.js"
import { ModelExportForm } from "./models/ExportForm.js"
import { ModelReceive } from "./models/Receive.js"
import { ModelPart } from "./models/Part.js"


app.get("/lay:name", async (req, res) => {
    let query = {}
    Object.keys(req.query).map(key => {
        if (key != 'limit' && key != 'page') {
            query = {
                ...query,
                [key]:req.query[key]
            }
        }
    })
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
    if (req.params.name == "Calendar")
        db = ModelCalendar 
    if (req.params.name == "FundBook")
        db = ModelFundBook  
    if (req.params.name == "AccountingEntry")
        db = ModelAccountingEntry
    if (req.params.name == "User")
        db = ModelUser
    if (req.params.name == "Product")
        db = ModelProduct
    if (req.params.name == "Import")
        db = ModelImportForm
    if (req.params.name == "Payment")
        db = ModelPayment
    if (req.params.name == "Debt")
        db = ModelDebt
    if (req.params.name == "Point")
        db = ModelPoint
    if (req.params.name == "Voucher")
        db = ModelVoucher
    if (req.params.name == "Export")
        db = ModelExportForm
    if (req.params.name == "Receive")
        db = ModelReceive
    if (req.params.name == "Part")
        db = ModelPart
    const data = await db.find(query).skip(validator.getOffset(req)).limit(validator.getLimit(req));
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
    if (req.params.name == "AccountingEntry")
        db = ModelAccountingEntry
    if (req.params.name == "User")
        db = ModelUser
    if (req.params.name == "Product")
        db = ModelProduct
    if (req.params.name == "Import")
        db = ModelImportForm
    if (req.params.name == "Payment")
        db = ModelPayment
    if (req.params.name == "Debt")
        db = ModelDebt
    if (req.params.name == "Point")
        db = ModelPoint
    if (req.params.name == "Voucher")
        db = ModelVoucher
    if (req.params.name == "Export")
        db = ModelExportForm
    if (req.params.name == "Receive")
        db = ModelReceive
    if (req.params.name == "Part")
        db = ModelPart
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
    await ModelAccountingEntry.updateMany({},{$set:{accounting_entry_create_debt:true}})
    return res.json(data)
})

app.get("/ABC", async (req, res) => {
    for (let i = 0; i < 15; i++){
        await new ModelEmployee({
            "employee_fullname": `Ngô Tú Vĩ${i}`,
            "employee_phone": `058742554${i}`,
            "employee_image": null,
            "employee_address": null,
            "id_branch": "61e15300a4665e6a0db700e8",
            "password": null,
            "employee_salary": 0,
            "employee_salary_duty": 0,
            "employee_status": false,
            "employee_bank_number": null,
            "employee_bank_name": null,
            "id_employee_group": "61e156b47dc2ff811e02ccb3",
            "employee_history_work": [],
            "employee_history_salary": [],
            "employee_lunch_allowance": 0,
            "employee_revenue_percent": 0,
            "employee_level": null,
            "employee_datebirth": "2022-01-21T08:41:05.917Z",
        }).save()
    }
    
    return res.json("ok")
})

app.get("/*", async (req, res) => {
    return res.status(404).render('pages/samples/error-404')
})

