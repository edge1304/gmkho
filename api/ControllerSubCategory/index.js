const prefixApi = '/api/subcategory';
import sanitize from "mongo-sanitize";
import * as helper from '../../helper/helper.js'
import * as validator from '../../helper/validator.js'

import {ModelSubCategory} from '../../models/SubCategory.js'
import {ModelCategory} from '../../models/Category.js'
import {ModelInventoryWarning} from '../../models/InventoryWarning.js'
import {ModelWarehouse} from '../../models/Warehouse.js'

export const management = async(app)=>{
    //#region api lấy danh sách chức năng và nhóm người dùng
    app.get(prefixApi, helper.authenToken, async (req, res)=>{
        try
        {
            if(!await helper.checkPermission("61e4cc4369a5d379b7a29821", req.body._caller.id_employee_group)) return res.status(403).send("Thất bại! Bạn không có quyền truy cập chức năng này")
            
            var arrCategory = []
            if(req.query.getOther === 'true')
            {
                arrCategory = await ModelCategory.find()
            }
            var query = {}
            if(validator.isDefine(req.query.key))
            {
                query = {
                    ...query,
                    subcategory_name:{$regex:".*"+ sanitize(req.query.key) +".*",$options:"$i"}
                }
            }
            if(validator.isDefine(req.query.id_category) && validator.ObjectId.isValid(req.query.id_category))
            {
                query = {
                    ...query,
                    id_category:req.query.id_category
                }
            }
            const data = await ModelSubCategory.find(query).skip(validator.getOffset(req)).limit(validator.getLimit(req))
            const count = await ModelSubCategory.countDocuments(query)
            return res.json({data:data, count:count, arrCategory:arrCategory})
        }
        catch(e)
        {
            console.log(e)
            return res.status(500).send("Thất bại! Có lỗi xảy ra")
        } 
    })
}


export const insert = async(app)=>{
    //#region api lấy danh sách chức năng và nhóm người dùng
    app.post(prefixApi, helper.authenToken, async (req, res)=>{
        try
        {
            if(!await helper.checkPermission("61e4cc4369a5d379b7a29821", req.body._caller.id_employee_group)) return res.status(403).send("Thất bại! Bạn không có quyền truy cập chức năng này")
            
            const subcategory_name = req.body.subcategory_name
            const subcategory_import_price = validator.tryParseInt( req.body.subcategory_import_price)
            const subcategory_export_price = validator.tryParseInt( req.body.subcategory_export_price)
            const subcategory_vat = validator.tryParseInt( req.body.subcategory_vat)
            const subcategory_ck = validator.tryParseInt( req.body.subcategory_ck)
            const subcategory_discount = validator.tryParseInt( req.body.subcategory_discount)
            const subcategory_warranty = validator.tryParseInt( req.body.subcategory_warranty)
            const subcategory_part = validator.tryParseInt( req.body.subcategory_part)
            const subcategory_point = validator.tryParseInt( req.body.subcategory_point)
            const subcategory_unit = req.body.subcategory_unit
            const number_warning = validator.tryParseInt(req.body.number_warning)
            const id_category = req.body.id_category

            const dataCategory = await ModelCategory.findById(id_category)
            if(!dataCategory) return res.status(400).send("Danh mục không tồn tại")
            try
            {
                const insertNew = await new ModelSubCategory({
                    subcategory_name:subcategory_name,
                    subcategory_import_price:subcategory_import_price,
                    subcategory_export_price:subcategory_export_price,
                    subcategory_vat:subcategory_vat,
                    subcategory_ck:subcategory_ck,
                    subcategory_discount:subcategory_discount,
                    subcategory_warranty:subcategory_warranty,
                    subcategory_part:subcategory_part,
                    subcategory_point:subcategory_point,
                    subcategory_unit:subcategory_unit,
                    id_category:id_category,
                }).save()

                if(!insertNew) return res.status(400).send("Thất bại! Có lỗi xảy ra")
                const dataWarehouse = await ModelWarehouse.find({id_branch:req.body._caller.id_branch_login})
                for(let i =0;i<dataWarehouse.length;i++)
                {
                    await new ModelInventoryWarning({
                        id_subcategory: insertNew._id ,
                        id_warehouse: dataWarehouse[i]._id ,//id chức năng
                        inventory_warning_number: number_warning
                    })
                }
                return res.json(insertNew)
                
            }
            catch(e)
            {
                console.log(e)
                return res.status(500).send("Thất bại! Có lỗi xảy ra")
            }
            

        }
        catch(e)
        {
            console.log(e)
            return res.status(500).send("Thất bại! Có lỗi xảy ra")
        } 
    })
}
