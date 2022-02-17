const prefixApi = '/api/export/export-sale';
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
export const checkPermission = async (app)=>{
    app.get(prefixApi,helper.authenToken, async (req, res)=>{
        try{
            if(!await helper.checkPermission("61ee7394fc3b22e001d48eae", req.body._caller.id_employee_group)) return res.status(403).send("Thất bại! Bạn không có quyền truy cập chức năng này")
            const warehouses = await warehouse.getWarehouseByBranch(req.body._caller.id_branch_login)
            const fundbooks = await fundbook.getFundbookByBranch(req.body._caller.id_branch_login)
            return res.json({warehouses: warehouses,fundbooks:fundbooks})
        }
        catch(e){
            return res.status(500).send("Thất bại! Có lỗi xảy ra")
        }
    })
}

export const checkPermissionMore = async (app)=>{
    app.get(prefixApi+"/more/:id_import",helper.authenToken, async (req, res)=>{
        try{
            if(!await helper.checkPermission("61ee7394fc3b22e001d48eae", req.body._caller.id_employee_group)) return res.status(403).send("Thất bại! Bạn không có quyền truy cập chức năng này")
            const warehouses = await warehouse.getWarehouseByBranch(req.body._caller.id_branch_login)
            const fundbooks = await fundbook.getFundbookByBranch(req.body._caller.id_branch_login)
            const id_import = req.params.id_import
            if (!validator.ObjectId.isValid(id_import)) return res.status(400).send("Thất bại! Không tìm thấy phiếu nhập")
            const dataImport = await ModelImportForm.findById(id_import)
            if (!dataImport) return res.status(400).send("Thất bại! Không tìm thấy phiếu nhập")
            if (dataImport.import_form_status_paid) return res.status(400).send("Thất bại!Phiếu nhập đã được thanh toán! Không thể tiếp tục nhập thêm")
            const user = await ModelUser.findById(dataImport.id_user)
            if (!user) return res.status(400).send("Thất bại! Không tìm thấy nhà cung cấp trước đó")
            dataImport.user_fullname = user.user_fullname
            dataImport.user_phone = user.user_phone
            dataImport.user_address = user.user_address
            return res.json({warehouses: warehouses,fundbooks:fundbooks, dataImport:dataImport})
        }
        catch (e) {
            console.log(e)
            return res.status(500).send("Thất bại! Có lỗi xảy ra")
        }
    })
}

export const insert = async (app)=>{
    app.post(prefixApi,helper.authenToken, async (req, res)=>{
        try{
            if (!await helper.checkPermission("620e1dc0ac9a6e7894da61d0", req.body._caller.id_employee_group)) return res.status(403).send("Thất bại! Bạn không có quyền truy cập chức năng này")
            create_form(req,res)

           

        }
        catch(e){
            return res.status(500).send("Thất bại! Có lỗi xảy ra")
        }
    })
}


export const create_form = async (req, res) => {
    const id_user = req.body.id_user
    const type_export = req.body.type_export
    const point_number = validator.tryParseInt(req.body.id_user)
    const code_discount = req.body.code_discount
    const export_form_note = req.body.export_form_note
    const receive_money = validator.tryParseInt(req.body.receive_money)
    const arrProduct = JSON.parse(req.body.arrProduct)
    const id_fundbook = req.body.id_fundbook
    
    const dataUser = await ModelUser.findById(id_user)
    if (!dataUser) return res.status(400).send("Thất bại! Không tìm thấy nhà cung cấp")
    const dataFundbook = await ModelFundBook.findById(id_fundbook)
    if(!dataFundbook) return res.status(400).send("Thất bại! Không tìm thấy sổ quỹ") 
    if (arrProduct.length == 0) return res.status(400).send("Hãy chọn ít nhất một sản phẩm")
    for (let i = 0; i < arrProduct.length; i++){  // kiểm tra xem có bị trùng lặp id sản phẩm ko
        for (let j = i + 1; j < arrProduct.length; j++){
            if (arrProduct[i].id_product == arrProduct[j].id_product) return res.status(400).send(`Thất bại! Mã sản phẩm ${arrProduct[j].id_product} bị lặp trùng`)
        }
    }
    const id_warehouse = null
    // bắt đầu tìm kiếm sản phẩm và kiểm tra
    for (let i = 0; i < arrProduct.length; i++){  // kiểm tra xem có bị trùng lặp id sản phẩm ko
        const product = await ModelProduct.findById(arrProduct[i].id_product)
        if (!product) return res.status(400).send(`Thất bại! Không tìm thấy sản phẩm có mã ${arrProduct[i].id_product}`)
        if (product.product_status) return res.status(400).send(`Thất bại! Sản phẩm ${product._id} đã được xuất kho`)

        if(i == 0) id_warehouse = product.id_warehouse
        const sub_category = await ModelSubCategory.findById(product.id_subcategory)
        if(!sub_category) return res.status(400).send(`Thất bại! Không tìm thấy tên của sản phẩm ${product._id}`)
        if(product.id_warehouse != id_warehouse) return res.status(400).send(`Thất bại! Sản phẩm có mã ${product._id} không cùng kho với các sản phẩm khác `) 
    }
}