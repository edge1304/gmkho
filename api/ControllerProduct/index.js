const prefixApi = '/api/product';
import sanitize from "mongo-sanitize";
import * as helper from '../../helper/helper.js'
import * as validator from '../../helper/validator.js'
import {ModelProduct} from '../../models/Product.js'
import {ModelSubCategory} from '../../models/SubCategory.js'
import { ModelImportForm } from '../../models/ImportForm.js'
import { ModelExportForm } from '../../models/ExportForm.js'
import { ModelCategory } from '../../models/Category.js'
import { ModelFundBook } from '../../models/FundBook.js'
import { ModelPayment } from '../../models/Payment.js'
import { ModelReceive } from '../../models/Receive.js'
import { ModelUser } from '../../models/User.js'
import { ModelWarehouse } from '../../models/Warehouse.js'
import { ModelBranch } from '../../models/Branch.js'
import { ModelEmployee } from '../../models/Employee.js'
import * as warehouse from '../ControllerWarehouse/index.js'

export const management = async (app)=>{
   
    // app.get(prefixApi, async (req, res)=>{
    //   console.log("??")
    // })
  
}



export const update = async (app)=>{
   
        app.put(prefixApi,  helper.authenToken, async (req, res)=>{
            if(!await helper.checkPermission("620c93815ce304199a9db351", req.body._caller.id_employee_group)) return res.status(403).send("Thất bại! Bạn không có quyền truy cập chức năng này")
           
            try
            {
                
              
            }
            catch(e)
            {
                console.log(e)
                return res.status(500).send("Thất bại! Có lỗi xảy ra")
            }
        })
    
}

export const getInfo =  (app) => {
    app.get(prefixApi,  helper.authenToken, async (req, res)=>{
        try {
            
            // if(!validator.ObjectId.isValid(req.query.id_product)) return res.status(400).send("Không tìm thấy ")
            let query = {}
            if (!validator.isDefine(req.query.key)) return res.status(400).send("Không tìm thấy sản phẩm")
    
            if (validator.isDefine(req.query.key) && validator.ObjectId.isValid(req.query.key)) {
                query = { $or: [{_id: sanitize(req.query.key.trim())},{id_product2: req.query.key.trim()}]}
            }
            else {
                query = {id_product2: req.query.key.trim()}
            }

            const dataProduct = await ModelProduct.findOne(query)
            if (!dataProduct) return res.status(400).send("Thất bại! Không tìm thấy sản phẩm")
            const dataSub = await ModelSubCategory.findById(dataProduct.id_subcategory)
            if (!dataSub) return res.status(400).send("Thất bại! Không tìm thấy sản phẩm")
            dataProduct.subcategory_import_price = dataSub.subcategory_import_price
            dataProduct.subcategory_export_price = dataSub.subcategory_export_price
            dataProduct.subcategory_name = dataSub.subcategory_name
            dataProduct.subcategory_vat = dataSub.subcategory_vat
            dataProduct.subcategory_ck = dataSub.subcategory_ck
            dataProduct.subcategory_point = dataSub.subcategory_point
            dataProduct.subcategory_discount = dataSub.subcategory_discount
            dataProduct.product_export_price = 0
            dataProduct.product_export_vat = 0
            dataProduct.product_export_ck = 0
            dataProduct.product_export_warranty = 0
            dataProduct.product_export_discount = 0
            let isImport = false
            const dataImport = await ModelImportForm.findById(dataProduct.id_import_form)
            dataProduct.supplier_fullname = ""
            dataProduct.id_supplier = null
            dataProduct.supplier_phone = ""
            dataProduct.supplier_address = ""

            if (!dataImport) return res.status(400).send("Không tìm thấy phiếu nhập của sản phẩm")
            for (let i = 0; i < dataImport.import_form_product.length; i++){
                if (dataProduct.product_index == dataImport.import_form_product[i].product_index) {
                    dataProduct.product_import_price = dataImport.import_form_product[i].product_import_price
                    dataProduct.product_vat = dataImport.import_form_product[i].product_vat
                    dataProduct.product_ck = dataImport.import_form_product[i].product_ck
                    dataProduct.product_warranty = dataImport.import_form_product[i].product_warranty
                    dataProduct.product_import_date = dataImport.createdAt
                    isImport = true
                    break
                }
            }
            if(validator.ObjectId.isValid(dataImport.id_user)){
                dataProduct.id_supplier = dataImport.id_user
                const dataSup = await ModelUser.findById(dataImport.id_user)
                if(dataSup){
                    dataProduct.supplier_fullname = dataSup.user_fullname
                    dataProduct.supplier_phone = dataSup.user_phone
                    dataProduct.supplier_address = dataSup.user_address
                }
            }
            if (validator.ObjectId.isValid(dataProduct.id_export_form)) {
                const dataExport = await ModelExportForm.findById(dataProduct.id_export_form)
                if (dataExport) {
                    for (let i = 0; i < dataExport.export_form_product.length; i++){
                        
                        if (dataExport.export_form_product[i].id_product.toString() == dataProduct._id.toString()) {
                            dataProduct.product_export_price = dataExport.export_form_product[i].product_export_price
                            dataProduct.product_export_vat = dataExport.export_form_product[i].product_vat
                            dataProduct.product_export_ck = dataExport.export_form_product[i].product_ck
                            dataProduct.product_export_warranty = dataExport.export_form_product[i].product_warranty
                            dataProduct.product_export_discount = dataExport.export_form_product[i].product_discount
                            dataProduct.product_export_date = dataExport.createdAt
                            dataProduct.id_employee = null
                            dataProduct.employee_fullname = ""
                            dataProduct.id_user = null
                            dataProduct.user_fullname = null
                            dataProduct.user_phone = null
                            dataProduct.user_address = null

                            if(validator.ObjectId(dataExport.export_form_product[i].id_employee)){
                                const dataEm = await ModelEmployee.findById(dataExport.export_form_product[i].id_employee)
                                if(dataEm){
                                    dataProduct.id_employee = dataEm._id
                                    dataProduct.employee_fullname = dataEm.employee_fullname
                                }
                            }
                            if(validator.ObjectId(dataExport.id_user)){
                                const dataUser = await ModelUser.findById(dataExport.id_user)
                                if(dataUser){
                                    dataProduct.id_user = dataUser._id
                                    dataProduct.user_fullname = dataUser.user_fullname
                                    dataProduct.user_phone = dataUser.user_phone
                                    dataProduct.user_address = dataUser.user_address
                                }
                            }
                            break
                        }
                    }
                }
            }
            if(!isImport)  return res.status(400).send("Không tìm thấy giá nhập của sản phẩm")
            return res.json(dataProduct)
            
        }
        catch(e){
            console.log(e)
            return res.status(500).send("Thất bại! Có lỗi xảy ra")
        }
    })
    
}

export const history = async (app)=>{
   
    app.get(prefixApi +"/history",helper.authenToken, async (req, res)=>{
      try
      {
            const key = req.query.key
            let query = {}
            if(validator.ObjectId.isValid(key)){
                query = {
                    $or:[{_id:validator.ObjectId(key)},{id_product2:key}]
                }
            }
            else{
                query = {
                    id_product2:key
                }
            }
            const dataProduct = await ModelProduct.findOne(query)
            if(!dataProduct) return res.status(400).send("Thất bại! Không tìm thấy sản phẩm")
            
            const datawarehouse_product = await ModelWarehouse.findById(dataProduct.id_warehouse)
            if(datawarehouse_product) dataProduct.warehouse_name = datawarehouse_product.warehouse_name

            const dataSub = await ModelSubCategory.findById(dataProduct.id_subcategory)
            if(dataSub) {
                dataProduct.subcategory_name = dataSub.subcategory_name
                if(validator.ObjectId.isValid(dataSub.id_category)){
                    const dataCategory = await ModelCategory.findById(dataSub.id_category)
                    if(dataCategory) dataProduct.category_name = dataCategory.category_name
                }
            }

            const dataImportFirst = await ModelImportForm.findById(dataProduct.id_import_form)
           
            const dataImport = await ModelImportForm.find({"import_form_product.id_product":dataProduct._id})
            const dataExport = await ModelExportForm.find({"export_form_product.id_product":dataProduct._id})

            dataImport.push(dataImportFirst)
            
            await Promise.all(dataImport.map( async data => {
                data.fundbook_name = ""
                data.payment_form_money = 0
                
                const dataUser = await ModelUser.findById(data.id_user)

                data.user_fullname = dataUser.user_fullname
                data.user_phone = dataUser.user_phone
                data.user_address = dataUser.user_address

                const dataWarehouse = await ModelWarehouse.findById(data.id_warehouse)
                if(dataWarehouse) {
                    data.warehouse_name = dataWarehouse.warehouse_name
                    const dataBranch = await ModelBranch.findById(dataWarehouse.id_branch)
                    if(dataBranch) data.branch_name = dataBranch.branch_name
                }

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

            await Promise.all(dataExport.map( async data => {
                data.fundbook_name = ""
                data.receive_form_money = 0

                const dataUser = await ModelUser.findById(data.id_user)

                data.user_fullname = dataUser.user_fullname
                data.user_phone = dataUser.user_phone
                data.user_address = dataUser.user_address

                const dataWarehouse = await ModelWarehouse.findById(data.id_warehouse)
                if(dataWarehouse) {
                    data.warehouse_name = dataWarehouse.warehouse_name
                    const dataBranch = await ModelBranch.findById(dataWarehouse.id_branch)
                    if(dataBranch) data.branch_name = dataBranch.branch_name
                }

                if (data.export_form_status_paid) {
                    const dataReceive = await ModelReceive.findOne({ id_form: data._id });
                    if (dataReceive) {
                        const data_fundbook = await ModelFundBook.findById(dataReceive.id_fundbook)
                        if (data_fundbook) {
                            
                            data.fundbook_name = data_fundbook.fundbook_name
                            data.receive_form_money = dataReceive.receive_money   
                        }
                    }
                }
                
            }))
            return res.json({dataProduct:dataProduct, dataImport:dataImport, dataExport:dataExport, dataSubCategory:dataSub})
      }
      catch(e){
        console.log(e)
        return res.status(500).send("Thất bại! Có lỗi xảy ra")
      }
    })
  
}

export const filter = async (app)=>{
    app.get(prefixApi +"/filter",  helper.authenToken, async (req, res)=>{
        if(!await helper.checkPermission("623ec0176751da4434562711", req.body._caller.id_employee_group)) return res.status(403).send("Thất bại! Bạn không có quyền truy cập chức năng này")
        try
        {
            const id_subcategory = req.query.id_subcategory
            const id_warehouse = req.query.id_warehouse
            const status = req.query.status

          
          
            if(!validator.ObjectId(id_subcategory)) return res.status(400).send("Thất bại! Không tìm thấy sản phẩm")
            if(!validator.ObjectId(id_warehouse)) return res.status(400).send("Thất bại! Không tìm thấy kho")

            const dataSub = await ModelSubCategory.findById(id_subcategory)
            if(!dataSub) return res.status(400).send("Thất bại! Không tìm thấy sản phẩm")
            let query = {id_warehouse:id_warehouse,id_subcategory:dataSub._id}
            if(validator.isDefine(status)){
                query = {
                    ...query,
                    product_status: status === 'true'
                }
                
            }
            const data = await ModelProduct.find(query)
            return res.json(data)
        }
        catch(e)
        {
            console.log(e)
            return res.status(500).send("Thất bại! Có lỗi xảy ra")
        }
    })
}

export const checkPermission_filter = async (app)=>{
    app.get(prefixApi +"/checkPermission/filter",  helper.authenToken, async (req, res)=>{
        if(!await helper.checkPermission("623ec0176751da4434562711", req.body._caller.id_employee_group)) return res.status(403).send("Thất bại! Bạn không có quyền truy cập chức năng này")
        try
        {
            const warehouses = await warehouse.getWarehouseByBranch(req.body._caller.id_branch_login)
            return res.json(warehouses)
        }
        catch(e)
        {
            console.log(e)
            return res.status(500).send("Thất bại! Có lỗi xảy ra")
        }
    })
}

export const report_sold_by_date = async (app)=>{
   
    app.get(prefixApi +"/product_sold_by_date",  helper.authenToken, async (req, res)=>{
        if(!await helper.checkPermission("620c93815ce304199a9db351", req.body._caller.id_employee_group)) return res.status(403).send("Thất bại! Bạn không có quyền truy cập chức năng này")
       
        try
        {
            let query = {...validator.query_createdAt(req.query.fromdate,req.query.todate)}
            if(validator.isDefine(req.query.id_warehouse) && validator.ObjectId.isValid(req.query.id_warehouse)){
                query = {
                    ...query,
                    id_warehouse:validator.ObjectId(req.query.id_warehouse)
                }
            }
            const dataExport = await ModelExportForm.aggregate([
                {
                    $match: {
                        ...query,
                    }
                },
                {
                    $unwind:{
                        path:"$export_form_product"
                    }
                },
                {
                    $project:{
                        _id:1,
                        id_user:1,
                        id_product:"$export_form_product.id_product",
                        id_product2:"$export_form_product.id_product2",
                        id_subcategory:"$export_form_product.id_subcategory",
                        product_export_price: "$export_form_product.product_export_price",
                        product_vat:"$export_form_product.product_vat",
                        product_ck :"$export_form_product.product_ck",
                        product_discount :"$export_form_product.product_discount",
                        product_quantity :"$export_form_product.product_quantity",
                        product_warranty :"$export_form_product.product_warranty",
                        product_import_price :"$export_form_product.product_import_price",                  
                        subcategory_part :"$export_form_product.id_subcategory",
                        id_employee :"$export_form_product.id_subcategory",
                        createdAt:1
                    }
                }
            ])

            for(let i =0;i<dataExport.length;i++){
                dataExport[i].user_fullname = ""
                dataExport[i].user_phone = ""
                dataExport[i].user_address = ""
                dataExport[i].employee_fullname = ""

                const dataSub = await ModelSubCategory.findById(dataExport[i].id_subcategory)
                if(!dataSub) return res.status(400).send(`Thất bại! Sản phẩm trong mã phiếu ${dataSub._id} không còn tìm thấy sản phẩm`)
                dataExport[i].subcategory_name = dataSub.subcategory_name

                const dataUser = await ModelUser.findById(dataExport[i].id_user)
                if(dataUser){
                    dataExport[i].user_fullname =  dataUser.user_fullname
                    dataExport[i].user_phone =  dataUser.user_phone
                    dataExport[i].user_address =  dataUser.user_address
                }
                if(dataExport[i].id_employee && validator.ObjectId.isValid(dataExport[i].id_employee) ){
                    const dataEmployee = await ModelEmployee.findById(dataExport[i].id_employee)
                    if(dataEmployee){
                        dataExport[i].employee_fullname = dataEmployee.employee_fullname
                    }
                }
            }
            const dataImportReturn = await ModelImportForm.aggregate([
                {
                    $match:{
                        ...query,
                        import_form_type:"Nhập hàng khách trả lại"
                    }
                },
                {
                    $unwind:{
                        path:"$import_form_product"
                    }
                },
                {
                    $project:{
                        _id:1,
                        id_user:1,
                        id_subcategory: "$import_form_product.id_subcategory",
                        id_product: "$import_form_product.id_product",
                        id_product2: "$import_form_product.id_product2",
                        product_import_price: "$import_form_product.product_import_price",
                        product_import_price_return: "$import_form_product.product_import_price_return",
                        product_export_price: "$import_form_product.product_export_price",
                        product_vat: "$import_form_product.product_vat",
                        product_ck: "$import_form_product.product_ck",
                        product_discount: "$import_form_product.product_discount",
                        product_quantity: "$import_form_product.product_quantity",
                        product_warranty: "$import_form_product.product_warranty",
                        product_index: "$import_form_product.product_index",   
                        id_employee: "$import_form_product.id_employee",

                    }
                }
            ])

            for(let i =0;i<dataImportReturn.length;i++){
                dataImportReturn[i].user_fullname = ""
                dataImportReturn[i].user_phone = ""
                dataImportReturn[i].user_address = ""
                dataImportReturn[i].employee_fullname = ""

                const dataSub = await ModelSubCategory.findById(dataImportReturn[i].id_subcategory)
                if(!dataSub) return res.status(400).send(`Thất bại! Sản phẩm trong mã phiếu nhập trả lại ${dataSub._id} không còn tìm thấy sản phẩm`)
                dataImportReturn[i].subcategory_name = dataSub.subcategory_name

                const dataUser = await ModelUser.findById(dataImportReturn[i].id_user)
                if(dataUser){
                    dataImportReturn[i].user_fullname =  dataUser.user_fullname
                    dataImportReturn[i].user_phone =  dataUser.user_phone
                    dataImportReturn[i].user_address =  dataUser.user_address
                }
                if(dataImportReturn[i].id_employee && validator.ObjectId.isValid(dataImportReturn[i].id_employee) ){
                    const dataEmployee = await ModelEmployee.findById(dataImportReturn[i].id_employee)
                    if(dataEmployee){
                        dataImportReturn[i].employee_fullname = dataEmployee.employee_fullname
                    }

                }
            }
            return res.json({dataExport:dataExport, dataImportReturn:dataImportReturn})
        }
        catch(e)
        {
            console.log(e)
            return res.status(500).send("Thất bại! Có lỗi xảy ra")
        }
    })

}