const prefixApi = '/api/product';
import sanitize from "mongo-sanitize";
import * as helper from '../../helper/helper.js'
import * as validator from '../../helper/validator.js'
import {ModelProduct} from '../../models/Product.js'
import {ModelSubCategory} from '../../models/SubCategory.js'
import { ModelImportForm } from '../../models/ImportForm.js'
import { ModelExportForm } from '../../models/ExportForm.js'


export const management = async (app)=>{
   
    app.get(prefixApi, async (req, res)=>{
      
    })
  
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
            if (!dataImport) return res.status(400).send("Không tìm thấy phiếu nhập của sản phẩm")
            for (let i = 0; i < dataImport.import_form_product.length; i++){
                if (dataProduct.product_index == dataImport.import_form_product[i].product_index) {
                    dataProduct.product_import_price = dataImport.import_form_product[i].product_import_price
                    dataProduct.product_vat = dataImport.import_form_product[i].product_vat
                    dataProduct.product_ck = dataImport.import_form_product[i].product_ck
                    dataProduct.product_warranty = dataImport.import_form_product[i].product_warranty
                    isImport = true
                    break
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

