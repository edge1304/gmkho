const prefixApi = '/api/inventory';
import sanitize from "mongo-sanitize";
import * as helper from '../../helper/helper.js'
import * as validator from '../../helper/validator.js'

import {ModelCategory} from '../../models/Category.js'
import {ModelSubCategory} from '../../models/SubCategory.js'
import {ModelExportForm} from '../../models/ExportForm.js'
import { ModelReportInventory } from '../../models/ReportInventory.js'

import * as warehouse from '../ControllerWarehouse/index.js'
import * as category from '../ControllerCategory/index.js'

export const checkPermission = async (app) => {
    app.get(prefixApi +"/checkPermission", helper.authenToken, async (req, res) => {
        if (!await helper.checkPermission("6229b26b9536efa0b53b053f", req.body._caller.id_employee_group)) return res.status(403).send("Thất bại! Bạn không có quyền truy cập chức năng này")
        const warehouses = await warehouse.getWarehouseByBranch(req.body._caller.id_branch_login)
        const categories = await category.get_array_category()
        return res.json({warehouses:warehouses, categories:categories})
    })
}


export const management = async (app) => {
    app.get(prefixApi, helper.authenToken, async (req, res) => {
        if (!await helper.checkPermission("6229b26b9536efa0b53b053f", req.body._caller.id_employee_group)) return res.status(403).send("Thất bại! Bạn không có quyền truy cập chức năng này")
        const fromdate = req.query.fromdate
        const todate = req.query.todate
        // let queryCurrent = {}
        // if (validator.isDefine(req.query.fromdate) && validator.isDefine(req.query.todate)) {
        //     queryPeriod = {
        //         createdAt: { $lt: validator.dateTimeZone(undefined, new Date(req.query.fromdate)).startOfDay } 
        //     }
        //     queryCurrent = {
        //         $and: [{ createdAt: { $gte: validator.dateTimeZone(undefined, new Date(req.query.fromdate)).startOfDay } },{ createdAt: { $lte:validator.dateTimeZone(undefined, new Date(req.query.todate)).endOfDay  } }]
        //     }
        // }
        const id_warehouse = req.query.id_warehouse
        if (!validator.ObjectId.isValid(id_warehouse)) return res.status(400).send("Thất bại! Không tìm thấy kho")
        const query = {
            id_warehouse:validator.ObjectId(id_warehouse), 
            createdAt: { $lte:validator.dateTimeZone(undefined, new Date(todate)).endOfDay  }
        }
        const dataImport = await ModelReportInventory.aggregate([
            {
                $match:query
            },
            {
                $project:{
                    id_subcategory:1,
                    quantity_import_period:{
                        $cond:{
                            if:{$lt:["$createdAt", validator.dateTimeZone(undefined, new Date(fromdate)).startOfDay] },
                            then: "$import_quantity",
                            else:0
                        }
                    },
                    money_import_period:{
                        $cond:{
                            if:{$lt:["$createdAt", validator.dateTimeZone(undefined, new Date(fromdate)).startOfDay] },
                            then: "$import_money",
                            else:0
                        }
                    },
                    quantity_import_current:{
                        $cond:{
                            if:{ $gte: ["$createdAt" ,validator.dateTimeZone(undefined, new Date(fromdate)).startOfDay ]},
                            then: "$import_quantity",
                            else:0
                        }
                    },
                    money_import_current:{
                        $cond:{
                            if:{ $gte: ["$createdAt" ,validator.dateTimeZone(undefined, new Date(fromdate)).startOfDay ]},
                            then: "$import_money",
                            else:0
                        }
                    }
                }
            },
            {
                $group:{
                    _id:"$id_subcategory",
                    quantity_import_period:{$sum:"$quantity_import_period"},
                    money_import_period:{$sum:"$money_import_period"},
                    quantity_import_current:{$sum:"$quantity_import_current"},
                    money_import_current:{$sum:"$money_import_current"},
                }
            }
        ])

        const dataExport = await ModelExportForm.aggregate([
            {
                $match:query
            },
            {
                $unwind:{
                    path:"$export_form_product"
                }
            },
            {
                $lookup:{
                    from:"products",
                    localField:"export_form_product.id_product",
                    foreignField:"_id",
                    as:"product"
                }
            },
            {
                $unwind:{
                    path:"$product"
                }
            },
            {
                $project:{
                    id_subcategory:"$export_form_product.id_subcategory",
                    money_import_of_export_period:{
                        $cond:{
                            if:{$lt:["$createdAt", validator.dateTimeZone(undefined, new Date(fromdate)).startOfDay] },
                            then: "$product.product_import_price",
                            else:0
                        }
                    }
                    ,
                    money_import_of_export_current:{
                        $cond:{
                            if:{$gte:["$createdAt", validator.dateTimeZone(undefined, new Date(fromdate)).startOfDay] },
                            then: "$product.product_import_price",
                            else:0
                        }
                    },
                    money_export_current:{
                        $cond:{
                            if:{$gte:["$createdAt", validator.dateTimeZone(undefined, new Date(fromdate)).startOfDay] },
                            then: {$multiply: [{ $subtract: [{ $subtract: ["$export_form_product.product_export_price", { $multiply: [{ $divide: ["$export_form_product.product_export_price", 100] }, "$export_form_product.product_ck"] }] }, "$export_form_product.product_discount"] }, "$export_form_product.product_quantity"] , },
                            else:0
                        }
                    },
                    quantity_export_current:{
                        $cond:{
                            if:{$gte:["$createdAt", validator.dateTimeZone(undefined, new Date(fromdate)).startOfDay] },
                            then: "$export_form_product.product_quantity",
                            else:0
                        }
                    },
                    quantity_export_period:{
                        $cond:{
                            if:{$lt:["$createdAt", validator.dateTimeZone(undefined, new Date(fromdate)).startOfDay] },
                            then: "$export_form_product.product_quantity",
                            else:0
                        }
                    },

                }
            },
            {
                $group: {
                    _id: "$id_subcategory",
                    money_import_of_export_period: { $sum: "$money_import_of_export_period" },
                    money_import_of_export_current: { $sum: "$money_import_of_export_current" },
                    money_export_current:{$sum:"$money_export_current"},
                    quantity_export_current:{$sum:"$quantity_export_current"},
                    quantity_export_period:{$sum:"$quantity_export_period"},
     
                    
                }
            }
            
        ])
        
        for(let i =0; i<dataImport.length;i++){
            dataImport[i].money_import_of_export_period = 0
            dataImport[i].money_import_of_export_current = 0
            dataImport[i].money_export_current = 0
            dataImport[i].quantity_export_current = 0
            dataImport[i].quantity_export_period = 0

            dataImport[i].subcategory_name = ""
            dataImport[i].id_category = ""
            const dataSub = await ModelSubCategory.findById(dataImport[i]._id)
            if(dataSub){
                dataImport[i].subcategory_name = dataSub.subcategory_name
                dataImport[i].id_category = dataSub.id_category
            }
            for(let j =0;j<dataExport.length; j++){
                if (dataImport[i]._id.toString() == dataExport[j]._id.toString()) {
                   
                    dataImport[i].money_import_of_export_period += dataExport[j].money_import_of_export_period 
                    dataImport[i].money_import_of_export_current += dataExport[j].money_import_of_export_current 
                    dataImport[i].money_export_current += dataExport[j].money_export_current 
                    dataImport[i].quantity_export_current += dataExport[j].quantity_export_current
                    dataImport[i].quantity_export_period += dataExport[j].quantity_export_period
                    dataExport.splice(j,1)
                    j--
            }
            }
        }

        return res.json(dataImport)
        
    })
}

