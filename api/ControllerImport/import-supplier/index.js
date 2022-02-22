const prefixApi = '/api/import/import-supplier';
import sanitize from "mongo-sanitize";
import * as helper from '../../../helper/helper.js'
import * as validator from '../../../helper/validator.js'
import * as warehouse from '../../ControllerWarehouse/index.js'
import * as fundbook from '../../ControllerFundBook/index.js'
import { ModelUser } from '../../../models/User.js'
import { ModelWarehouse } from '../../../models/Warehouse.js'
import { ModelFundBook } from '../../../models/FundBook.js'
import { ModelImportForm } from '../../../models/ImportForm.js'
import { ModelProduct } from '../../../models/Product.js'
import { ModelSubCategory } from '../../../models/SubCategory.js'
import { ModelDebt } from '../../../models/Debt.js'
import { ModelPayment } from '../../../models/Payment.js'

export const management = async (app)=>{
    app.get(prefixApi,helper.authenToken, async (req, res)=>{
        try{
            if(!await helper.checkPermission("61ee7394fc3b22e001d48eae", req.body._caller.id_employee_group)) return res.status(403).send("Thất bại! Bạn không có quyền truy cập chức năng này")
            let query = {}
            if (validator.isDefine(req.query.id_warehouse) && validator.ObjectId.isValid(req.query.id_warehouse)) {
                query = {
                    ...query,
                    id_warehouse: validator.ObjectId(req.query.id_warehouse),
                }
            }
            if (validator.isDefine(req.query.fromdate) && validator.isDefine(req.query.todate)) {
                query = {
                    ...query,
                    $and: [{ createdAt: { $gte: validator.dateTimeZone(undefined, new Date(req.query.fromdate)).startOfDay } },{ createdAt: { $lte:validator.dateTimeZone(undefined, new Date(req.query.todate)).endOfDay  } }]
                }
            }
            if (validator.isDefine(req.query.import_form_type)) {
                query = {
                    ...query,
                    import_form_type:req.query.import_form_type
                }
            }
            if (validator.isDefine(req.query.key)) {
                query = {
                    ...query,
                    $or: [{ "user.user_fullname":{$regex:".*"+req.query.key+".*", $options:"$i"}},{"user.user_phone":{$regex:".*"+req.query.key+".*", $options:"$i"}},{"import_form_product.subcategory_name":{$regex:".*"+req.query.key+".*", $options:"$i"}}]
                }
            }
            if (validator.isDefine(req.query.key) && validator.ObjectId.isValid(req.query.key)) {
                query = {_id: validator.ObjectId(req.query.key)}
                    
            }
            const datas = await ModelImportForm.aggregate([
                {
                    $lookup: {
                        from: "users",
                        localField: "id_user",
                        foreignField: "_id",
                        as:"user"
                    }
                }, {
                    $unwind: {
                        path: "$user",
                    }
                },
                {
                    $match:query
                },
                {
                    $sort:{_id:-1}
                }
               
            ]).skip(validator.getOffset(req)).limit(validator.getLimit(req))

            const count = await ModelImportForm.aggregate([
                {
                    $lookup: {
                        from: "users",
                        localField: "id_user",
                        foreignField: "_id",
                        as:"user"
                    }
                }, {
                    $unwind: {
                        path: "$user",
                    }
                },
                {
                    $match:query
                },
                {
                    $count:"count"
                }
               
            ])
            await Promise.all(datas.map( async data => {
                data.fundbook_name = ""
                data.payment_form_money = 0
                data.user_fullname = data.user.user_fullname
                data.user_phone = data.user.user_phone
                data.user_address = data.user.user_address
                delete data.user
                if (data.import_form_status_paid) {
                    const dataPayment = await ModelPayment.findOne({ id_form: data._id });
                    if (dataPayment) {
                        const data_fundbook = await ModelFundBook.findById(dataPayment.id_fundbook)
                        
                        if (data_fundbook) {
                            
                            data.fundbook_name = data_fundbook.fundbook_name
                            data.payment_form_money = dataPayment.payment_money   
                        }
                    }
                }
                
            }))
            
            return res.json({data:datas, count:count.length>0?count[0].count:0})
        }
        catch (e) {
            console.log(e)
            return res.status(500).send("Thất bại! Có lỗi xảy ra")
        }
    })
}
export const update = async (app)=>{
    app.put(prefixApi,helper.authenToken, async (req, res)=>{
        try{
            if (!await helper.checkPermission("61ee7394fc3b22e001d48eae", req.body._caller.id_employee_group)) return res.status(403).send("Thất bại! Bạn không có quyền truy cập chức năng này")
         
            const is_payment_zero = req.body.is_payment_zero==='true'
            const arrProduct = JSON.parse(req.body.arrProduct) // mảng sản phẩm mới
            const id_import = req.body.id_import  // id phiếu nhập cần update
            const payment_form_money = validator.tryParseInt(req.body.payment_form_money) //tiền khách thanh toán
            const id_fundbook = req.body.id_fundbook  // sổ quỹ
            const import_form_note = req.body.import_form_note  // ghi chú mới + ghi chú cũ
            const dataImport = await ModelImportForm.findById(id_import)  
            if (!dataImport) return res.status(400).send("Thất bại! Không tìm thấy phiếu nhập")
            const dataDebt = await ModelDebt.findOne({ id_form: dataImport._id })
            if(!dataDebt) return res.status(400).send("Thất bại! Không tìm thầy công nợ cũ")
            if(arrProduct.length != dataImport.import_form_product.length) return res.status(400).send("Thất bại! Dữ liệu không khớp xin hãy load lại trang")
            const data_fundbook = await ModelFundBook.findById(id_fundbook)
            if(!data_fundbook) return res.status(400).send("Thất bại! Không tìm thấy hình thức thanh toán phù hợp")
          
            const dataProducts = await ModelProduct.find({id_import_form:dataImport._id})
            var isSame  = 0; // đây là biến xác định đã trùng hết mã sp hay chưa
            for(let i = 0;i<arrProduct.length;i++ ){
                for(let j = 0;j<dataProducts.length;j++){
                    if(arrProduct[i].product_index == dataProducts[j].product_index){ // nếu cùng index sẽ được thay đổi
                        isSame ++
                        dataProducts[j] = {
                            ...dataProducts[j],
                            product_warranty:arrProduct[i].product_warranty, // cập nhập lại mỗi bảo hành thôi , còn cái khác láy từ phiếu nhập ra
                        }
                    }
                }
            }
            // console.log(dataProducts)
            if(isSame != dataProducts.length) return res.status(400).send("Thất bại! Có sản phẩm không phù hợp")
            for(let i =0;i<dataProducts.length;i++){
                await ModelProduct.findByIdAndUpdate(dataProducts[i]._id,dataProducts[i]) // cập nhập lại sản phẩm cũ với bảo hành mới
            }
            let isPayment = false
            if (payment_form_money > 0 || is_payment_zero) {
                const insertPayment = new ModelPayment({
                    id_user: dataImport.id_user,
                    payment_money: payment_form_money,
                    id_employee: req.body._caller._id,
                    id_branch: req.body._caller.id_branch_login,
                    id_form:dataImport._id,
                    payment_note: import_form_note,
                    payment_content:"61fe7f6b50262301a2a39fd4", // "Chi trả nhập hàng từ nhà cung cấp",
                    id_fundbook: id_fundbook,
                    payment_type: "import",
                }).save()
                isPayment = true
            }
            
            const total = validator.calculateMoneyImport(arrProduct)
            await ModelDebt.findByIdAndUpdate(dataDebt._id, {
                debt_money_import: total,
                debt_money_payment:payment_form_money
            })
            const updateImport = await ModelImportForm.findByIdAndUpdate(dataImport._id, {  // 
                import_form_status_paid: isPayment, 
                import_form_product: arrProduct,
                import_form_note:import_form_note
            })
            // chỗ này thiếu chỗ phải cập nhập giá ở các phiếu xuất
            
            return res.json(updateImport)
            
        }
        catch (e) {
            console.log(e)
            return res.status(500).send("Thất bại! Có lỗi xảy ra")
        }
    })
}