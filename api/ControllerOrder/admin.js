const prefixApi = '/api/order/admin';
import sanitize from "mongo-sanitize";
import * as helper from '../../helper/helper.js'
import * as validator from '../../helper/validator.js'
import {ModelDebt} from '../../models/Debt.js'
import {ModelWarehouse} from '../../models/Warehouse.js'
import {ModelProduct} from '../../models/Product.js'
import {ModelUser} from '../../models/User.js'
import {ModelSubCategory} from '../../models/SubCategory.js'
import {ModelOrder} from '../../models/Order.js'
import {ModelExportForm} from '../../models/ExportForm.js'
import {ModelReceive} from '../../models/Receive.js'
import {ModelFundBook} from '../../models/FundBook.js'
import {getWarehouseByBranch , getWarehouseOtherBranch} from './../ControllerWarehouse/index.js'
import { getFundbookByBranch } from './../ControllerFundBook/index.js'
import {checkCodeDiscountReturnError , update_status_voucher} from '../ControllerVoucher/index.js'
import {checkPointReturnZero, update_point_user} from '../ControllerPoint/index.js'
import {ModelNotificationUser} from '../../models/Notification_User.js'
export const management = async (app)=>{
    app.get(prefixApi,  helper.authenToken, async (req, res)=>{
        try
        {
            let query = {}
            if (validator.isDefine(req.query.fromdate) && validator.isDefine(req.query.todate)) {
                query = {
                    ...query,
                    $and: [{ createdAt: { $gte: validator.dateTimeZone(undefined, new Date(req.query.fromdate)).startOfDay } },{ createdAt: { $lte:validator.dateTimeZone(undefined, new Date(req.query.todate)).endOfDay  } }]
                }
            }
            
            if (validator.isDefine(req.query.order_status)) {
                query = {
                    ...query,
                    order_status:req.query.order_status
                }
            }
            if (validator.isDefine(req.query.key)) {
                query = {
                    ...query,
                    $or: [{ "user.user_fullname":{$regex:".*"+req.query.key+".*", $options:"$i"}},{"user.user_phone":{$regex:".*"+req.query.key+".*", $options:"$i"}},{"order_product.subcategory_name":{$regex:".*"+req.query.key+".*", $options:"$i"}}]
                }
            }
            if (validator.isDefine(req.query.key) && validator.ObjectId.isValid(req.query.key)) {
                query = {_id: validator.ObjectId(req.query.key)}
                    
            }
            query = {
                ...query,
                id_branch: validator.ObjectId(req.body._caller.id_branch_login)
            }

            const data = await ModelOrder.aggregate([
                {
                    $lookup: {
                        from: "users",
                        localField: "id_user",
                        foreignField: "_id",
                        as:"user"
                    }
                }, 
                {
                    $match:query
                },
                {
                    $sort: {
                        _id:-1
                    }
                }
            ]).skip(validator.getOffset(req)).limit(validator.getLimit(req))

            const count = await ModelOrder.aggregate([
                {
                    $lookup: {
                        from: "users",
                        localField: "id_user",
                        foreignField: "_id",
                        as:"user"
                    }
                }, {
                    $match:query
                },
                {
                    $count:"count"
                }
            ])
           
            await Promise.all( data.map(async order => {
                console.log(order)
                order.user_fullname = order.user[0].user_fullname
                order.user_phone = order.user[0].user_phone
                order.fundbook_name = ""
                order.receive_money = 0
                delete order.user

                if (validator.ObjectId.isValid(order.id_export_form)) {
                    const dataExport = await ModelExportForm.findById(order.id_export_form)
                    if (dataExport && dataExport.export_form_status_paid) {
                        const dataReceive = await ModelReceive.findOne({ id_form: dataExport._id })
                        if (dataReceive) {
                            order.receive_money = dataReceive.receive_money
                            const dataFund = await ModelFundBook.findById(dataReceive.id_fundbook)
                            if(dataFund) order.fundbook_name = dataFund.fundbook_name
                        }
                    }
                }
            }))
            return res.json({data:data , count: count.length > 0?count[0].count:0})
            
        }
        catch(e)
        {
            console.log(e)
            return res.status(500).send("Th???t b???i! C?? l???i x???y ra")
        }
    })
}

export const checkPermissionExport = async(app)=>{
    //#region api l???y danh s??ch ch???c n??ng v?? nh??m ng?????i d??ng
    app.get(prefixApi+"/checkPermission/export" , helper.authenToken, async (req, res)=>{
        try
        {
            if (!await helper.checkPermission("621ee03865df76e0f9fecc0b", req.body._caller.id_employee_group)) return res.status(403).send("Th???t b???i! B???n kh??ng c?? quy???n truy c???p ch???c n??ng n??y")
            const fundbooks = await getFundbookByBranch(req.body._caller.id_branch_login)
            const id_order = req.query.id_order
            if (!validator.ObjectId.isValid(id_order)) return res.status(400).send("Th???t b???i! Kh??ng t??m th???y ????n ????? xu???t")
            const dataOrder = await ModelOrder.findById(id_order)
            if (!dataOrder) return res.status(400).send("Th???t b???i! Kh??ng t??m th???y phi???u ????? xu???t")
            if (dataOrder.order_status != "Ch??a x??? l??") return res.status(400).send("Th???t b???i! Phi???u n??y ???? ???????c x??? l??, kh??ng th??? xu???t th??m")
            const dataUser = await ModelUser.findById(dataOrder.id_user)
            if (!dataOrder) return res.status(400).send("Th???t b???i! Kh??ng t??m th???y kh??ch h??ng")
            dataOrder.user_fullname = dataUser.user_fullname
            dataOrder.user_phone = dataUser.user_phone
            dataOrder.user_address = dataUser.user_address
            dataOrder.user_point = dataUser.user_point
            return res.json({fundbooks:fundbooks, dataOrder:dataOrder})
        }
        catch(e)
        {
            console.log(e)
            return res.status(500).send("Th???t b???i! C?? l???i x???y ra")
        } 
    })
    //#endregion api l???y danh s??ch ch???c n??ng v?? nh??m ng?????i d??ng

}

export const confirmExport = async (app) => {
    app.post(prefixApi +"/export", helper.authenToken, async (req, res)=>{
        try
        {
            if (!await helper.checkPermission("62148d3bfa02d1423dd506f0", req.body._caller.id_employee_group)) return res.status(403).send("Th???t b???i! B???n kh??ng c?? quy???n truy c???p ch???c n??ng n??y")
          
            const id_order = req.body.id_order
            if (!validator.ObjectId.isValid(id_order)) return res.status(400).send("Th???t b???i! Kh??ng t??m th???y phi???u ????? xu???t")
            const dataOrder = await ModelOrder.findById(id_order)
            if (!dataOrder) return res.status(400).send("Th???t b???i! Kh??ng t??m th???y phi???u ????? xu???t")
            if(dataOrder.order_status != "Ch??a x??? l??") return res.status(400).send("Th???t b???i! ????n n??y ???? ???????c x??? l??, kh??ng th??? xu???t")
         
            const id_branch = req.body._caller.id_branch_login
            const id_user = req.body.id_user
            const type_export = req.body.type_export
            const point_number = validator.tryParseInt(req.body.point_number)
            const id_employee_setting = req.body.id_employee_setting
            const export_form_note = req.body.export_form_note
            const receive_money = validator.tryParseInt(req.body.receive_money)
            const arrProduct = JSON.parse(req.body.arrProduct)
            const id_fundbook = req.body.id_fundbook
            const id_employee = req.body._caller._id
            const dataUser = await ModelUser.findById(id_user)
            if (!dataUser) return res.status(400).send("Th???t b???i! Kh??ng t??m th???y nh?? cung c???p")
            const dataFundbook = await ModelFundBook.findById(id_fundbook)
            if(!dataFundbook) return res.status(400).send("Th???t b???i! Kh??ng t??m th???y s??? qu???") 
            if (arrProduct.length == 0) return res.status(400).send("H??y ch???n ??t nh???t m???t s???n ph???m")
            for (let i = 0; i < arrProduct.length; i++){  // ki???m tra xem c?? b??? tr??ng l???p id s???n ph???m ko
                for (let j = i + 1; j < arrProduct.length; j++){
                    if (arrProduct[i].id_product == arrProduct[j].id_product) return res.status(400).send(`Th???t b???i! M?? s???n ph???m ${arrProduct[j].id_product} b??? l???p tr??ng`)
                }
            }
            var id_warehouse = null
            let totalPoint = 0
            // b???t ?????u t??m ki???m s???n ph???m v?? ki???m tra
            for (let i = 0; i < arrProduct.length; i++){  // ki???m tra xem c?? b??? tr??ng l???p id s???n ph???m ko
                const product = await ModelProduct.findById(arrProduct[i].id_product)
                if (!product) return res.status(400).send(`Th???t b???i! Kh??ng t??m th???y s???n ph???m c?? m?? ${arrProduct[i].id_product}`)
                if (product.product_status) return res.status(400).send(`Th???t b???i! S???n ph???m ${product._id} ???? ???????c xu???t kho`)

                if (i == 0) id_warehouse = product.id_warehouse
          
                const sub_category = await ModelSubCategory.findById(product.id_subcategory)
                if (!sub_category) return res.status(400).send(`Th???t b???i! Kh??ng t??m th???y t??n c???a s???n ph???m ${product._id}`)
                if (product.id_warehouse.toString() != id_warehouse.toString()) return res.status(400).send(`Th???t b???i! S???n ph???m c?? m?? ${product._id} kh??ng c??ng kho ???????c ???? xu???t `) 
                arrProduct[i].id_product2 = product.id_product2
                arrProduct[i].id_subcategory = product.id_subcategory
                arrProduct[i].subcategory_name = sub_category.subcategory_name
                arrProduct[i].subcategory_part = sub_category.subcategory_part
                arrProduct[i].subcategory_point = sub_category.subcategory_point
                arrProduct[i].product_import_price = product.product_import_price

                if(validator.ObjectId.isValid(dataOrder.order_product[0].id_employee))
                    arrProduct[i].id_employee = dataOrder.order_product[0].id_employee
                totalPoint += sub_category.subcategory_point
            }
            const total = validator.calculateMoneyExport(arrProduct)
            const money_voucher_code = dataOrder.money_voucher_code
            const money_point = dataOrder.money_point
            const data_warehouse = await ModelWarehouse.findById(id_warehouse)
            if (!data_warehouse) return res.status(400).send("Th???t b???i! Kh??ng t??m th???y kho c???a s???n ph???m")
        
            if(data_warehouse.id_branch.toString() != id_branch.toString()) return res.status(400).send("Kho c???a s???n ph??m kh??ng thu???c chi nh??nh n??y")
            const is_payment = true // tr???ng th??i ???? thanh to??n ch??a c???a phi???u xu???t
          
            
            const insertFormExport = await new ModelExportForm({  // t???o phi???u xu???t tr?????c
                id_warehouse: data_warehouse._id,
                id_employee: id_employee,
                id_user: dataUser._id,
                export_form_status_paid:is_payment,
                export_form_product:  arrProduct,
                export_form_note:export_form_note,
                export_form_type:type_export,
                point_number: point_number,
                voucher_code: dataOrder.voucher_code,
                money_voucher_code: money_voucher_code,
                money_point: money_point,
                id_employee_setting:id_employee_setting
                
                // createdAt: validator.dateTimeZone().currentTime
            }).save()

            const insertDebt = await new ModelDebt({  // t???o c??ng n???
                    id_user: dataUser._id,// t??n nh??n vi??n
                    id_branch: id_branch,
                    id_employee: id_employee,
                    debt_money_receive: receive_money + money_point + money_voucher_code ,
                    debt_money_export: total,
                    debt_note: export_form_note,
                    debt_type:"export",
                    id_form: insertFormExport._id,
            }).save()
           
                const receive = await ModelReceive({
                    id_user: dataUser._id,// ng?????i d??ng
                    receive_money: receive_money,
                    receive_type:"export", // lo???i chi t??? : import (phi???u nh???p ), export(phi???u xu???t)
                    id_employee: id_employee,
                    id_branch: id_branch,
                    receive_content: "61fe7ec950262301a2a39fcc",
                    id_form: insertFormExport._id, // id t??? m?? phi???u t???o (phi???u nh???p , xu???t . ..)
                    receive_note: export_form_note, // ghi ch??
                    id_fundbook: dataFundbook._id,
                }).save()
            
            
                
            for (let i = 0; i < arrProduct.length; i++){
                await ModelProduct.findByIdAndUpdate(arrProduct[i].id_product,{
                    $set:{
                        product_status:true, product_warranty: arrProduct[i].product_warranty ,id_export_form: insertFormExport._id
                    },
                    $push:{
                        product_note:`${ validator.dateTimeZone().currentTime} xu???t h??ng t??? ????n h??ng tr??n web.M?? phi???u xu???t ${insertFormExport._id} t??? kho ${data_warehouse.warehouse_name}, nv = ${id_employee}, kh = ${dataUser._id} - ${dataUser.user_fullname}`
                    }
                })
            }
        
            if (total <= (money_point + money_voucher_code + receive_money)) {
                await ModelUser.findByIdAndUpdate(id_user,{$inc:{user_point: totalPoint}})
            }
            await ModelOrder.findByIdAndUpdate(dataOrder._id, {
                order_status: "??ang giao h??ng",
                id_export_form: insertFormExport._id,
                order_product:arrProduct
            })

            await new ModelNotificationUser({
                notification_title:"Th??ng b??o",
                notification_content:`????n h??ng c???a b???n ???? ???????c giao. M?? ????n h??ng c???a b???n l?? ${dataOrder._id}`,
                notification_time: new Date(),
                id_from:dataOrder._id,
                notification_type:"Order",
                notification_topic: dataOrder.order_phone,
                id_user: dataUser._id
            }).save()
            validator.notifyTopic(dataUser.user_phone,"Th??ng b??o",`????n h??ng c???a b???n ???? ???????c giao. M?? ????n h??ng c???a b???n l?? ${dataOrder._id}`)
            return res.json(insertFormExport)

            }
            catch(e)
            {
                console.log(e)
                return res.status(500).send("Th???t b???i! C?? l???i x???y ra")
            } 
    })
}
export const updateStatus = async(app)=>{
    //#region api l???y danh s??ch ch???c n??ng v?? nh??m ng?????i d??ng
    app.put(prefixApi+"/status" , helper.authenToken, async (req, res)=>{
        try
        {
            if (!await helper.checkPermission("621ee03865df76e0f9fecc0b", req.body._caller.id_employee_group)) return res.status(403).send("Th???t b???i! B???n kh??ng c?? quy???n truy c???p ch???c n??ng n??y")
           
            const id_order = req.body.id_order
            if (!validator.ObjectId.isValid(id_order)) return res.status(400).send("Th???t b???i! Kh??ng t??m th???y ????n h??ng")
            const dataOrder = await ModelOrder.findById(id_order)
            if (!dataOrder) return res.status(400).send("Th???t b???i! Kh??ng t??m th???y phi???u ????? xu???t")
            if (dataOrder.order_status != "??ang giao h??ng") return res.status(400).send("Th???t b???i! Phi???u n??y ch??a xu???t h??ng, kh??ng th??? chuy???n sang ho??n th??nh")
            const dataUser = await ModelUser.findById(dataOrder.id_user)
            const updateS = await ModelOrder.findByIdAndUpdate(dataOrder._id, {
                order_status:"Ho??n th??nh"
            })
            await new ModelNotificationUser({
                notification_title:"Th??ng b??o",
                notification_content:`????n h??ng c???a b???n ???? ho??n th??nh. M?? ????n h??ng c???a b???n l?? ${dataOrder._id}`,
                notification_time: new Date(),
                id_from:dataOrder._id,
                notification_type:"Order",
                notification_topic: dataOrder.order_phone,
                id_user: dataUser._id
            }).save()
            validator.notifyTopic(dataUser.user_phone,"Th??ng b??o",`????n h??ng c???a b???n ???? ho??n th??nh. M?? ????n h??ng c???a b???n l?? ${dataOrder._id}`)
            return res.json(updateS)
        }
        catch(e)
        {
            console.log(e)
            return res.status(500).send("Th???t b???i! C?? l???i x???y ra")
        } 
    })
    //#endregion api l???y danh s??ch ch???c n??ng v?? nh??m ng?????i d??ng

}

export const insert = async (app) => {
    app.post(prefixApi,  helper.authenToken, async (req, res)=>{
        try
        {
            const id_user = req.body.id_user
            const dataUser = await ModelUser.findById(id_user)
            if(!dataUser) return res.status(400).send("Th???t b???i! Kh??ng t??m th???y kh??ch h??ng")
            const arrProduct = JSON.parse(req.body.arrProduct)
            const voucher_code = req.body.voucher_code === 'null'?null:req.body.voucher_code
            const point_number = validator.tryParseInt(req.body.point_number)
            var money_voucher_code = 0
            var money_point = 0
            if (arrProduct.length == 0) return res.status(400).send("H??y th??m ??t nh???t 1 s???n ph???m")
        
           const arrOrderProduct = []
            for (let i = 0; i < arrProduct.length; i++){
             
                const dataSub = await ModelSubCategory.findById(arrProduct[i].id_subcategory)
                if (!dataSub) return res.status(400).send("Th???t b???i! Kh??ng t??m th???y s???n ph???m")
                for (let j = 0; j < arrProduct[i].product_quantity; j++){
                    arrOrderProduct.push({
                        id_subcategory: dataSub._id,
                        subcategory_name: dataSub.subcategory_name,
                        subcategory_image: dataSub.subcategory_images,
                        product_export_price: arrProduct[i].product_export_price,
                        product_vat: arrProduct[i].product_vat,
                        product_ck: arrProduct[i].product_ck,
                        product_discount:arrProduct[i].product_discount,
                        product_warranty:arrProduct[i].subcategory_warranty,
                        subcategory_point:  dataSub.subcategory_point,
                        subcategory_part: dataSub.subcategory_part,
                        product_quantity:1,
                        id_employee: req.body._caller._id
                    })
                }
                
            }
            const totalMoney = validator.calculateMoneyExport(arrOrderProduct)
            if (voucher_code && voucher_code.length > 0) {
                money_voucher_code = await checkCodeDiscountReturnError(voucher_code, totalMoney)
                if(isNaN(money_voucher_code)) return res.status(400).send(money_voucher_code)
            }
            if (point_number > 0) {
                money_point = await checkPointReturnZero(id_user, point_number)
                if(isNaN(money_point)) return res.status(400).send(money_point)
            }

            const insertOrder = await new ModelOrder({
                id_branch: req.body._caller.id_branch_login,
                id_user: dataUser._id,
                order_product: arrOrderProduct,
                order_status: "Ch??a x??? l??",
                voucher_code: voucher_code,
                point_number: point_number,
                money_voucher_code: money_voucher_code,
                money_point: money_point,
                order_address: dataUser.user_address,
                order_phone: dataUser.user_phone,
                order_note:"nh??n vi??n t???o t??? web"
            }).save()

            if (voucher_code && voucher_code.length > 0) {
                await update_status_voucher(voucher_code)
            }
            if (point_number > 0) {
                await ModelUser.findByIdAndUpdate(id_user, {
                    $inc: { user_point: -point_number }
                })
            }
           
            return res.json(insertOrder)
        }
        catch(e)
        {
            console.log(e)
            return res.status(500).send("Th???t b???i! C?? l???i x???y ra")
        }
    })
    
}
