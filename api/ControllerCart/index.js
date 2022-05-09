const prefixApi = '/api/cart';
import sanitize from "mongo-sanitize";
import * as helper from '../../helper/helper.js'
import * as validator from '../../helper/validator.js'
import {ModelCart} from '../../models/Cart.js'
import {ModelSubCategory} from '../../models/SubCategory.js'


export const management = async(app)=>{
    //#region api lấy danh sách chức năng và nhóm người dùng
    app.get(prefixApi, helper.authenToken, async (req, res)=>{
        try
        {
            const id_user = req.body._caller._id
            const data = await ModelCart.find({ id_user: id_user }).skip(validator.getOffset(req)).limit(validator.getLimit(req))
            for (let i = 0; i < data.length; i++){
                const dataSub = await ModelSubCategory.findById(data[i].cart_product.id_subcategory)
                
                data[i].cart_product = {
                    ...data[i].cart_product,
                    subcategory_export_price: dataSub.subcategory_export_price,
                    subcategory_discount: dataSub.subcategory_discount,
                    subcategory_vat: dataSub.subcategory_vat,
                    subcategory_ck: dataSub.subcategory_ck,
                    subcategory_warranty: dataSub.subcategory_warranty,
                    subcategory_unit: dataSub.subcategory_unit,
                    subcategory_images: dataSub.subcategory_images,
                    subcategory_name: dataSub.subcategory_name,
                }
      
            }
            return res.json(data)
        }
        catch(e)
        {
            console.log(e)
            return res.status(500).send("Thất bại! Có lỗi xảy ra")
        } 
    })
    //#endregion api lấy danh sách chức năng và nhóm người dùng
}

export const insert = async(app)=>{
    //#region api lấy danh sách chức năng và nhóm người dùng
    app.post(prefixApi, helper.authenToken, async (req, res)=>{
        try
        {
            const id_subcategory = req.body.id_subcategory
            const id_user = req.body._caller._id
            if (!validator.ObjectId.isValid(id_subcategory)) return res.status(400).send("Thất bại! Không tìm thấy sản phẩm")
            
            const dataSub = await ModelSubCategory.findById(id_subcategory)
            if (!dataSub) return res.status(400).send("Thất bại! Không tìm thấy sản phẩm")
            
            const dataCart = await ModelCart.findOne({id_user: id_user, "cart_product.id_subcategory": dataSub._id }) // kiểm tra trong danh sách cart của user đã có sản phẩm này chưa
            if (dataCart) { // đã tồn tại thì tăng số lượng lên 1
                dataCart.cart_product.subcategory_quantity += 1
                
                const updateCart = await ModelCart.findByIdAndUpdate(dataCart._id, {
                    cart_product:dataCart.cart_product
                })
                const result = {
                    ...dataCart,
                    cart_product: {
                        ...dataCart.cart_product,
                        subcategory_export_price: dataSub.subcategory_export_price,
                        subcategory_discount: dataSub.subcategory_discount,
                        subcategory_vat: dataSub.subcategory_vat,
                        subcategory_ck: dataSub.subcategory_ck,
                        subcategory_warranty: dataSub.subcategory_warranty,
                        subcategory_unit: dataSub.subcategory_unit,
                        subcategory_images: dataSub.subcategory_images,
                    }
                }
               
                return res.json(result)
            }
            else { // chưa có thì tạo mới
                const insertCart = await new ModelCart({
                    id_user: id_user,
                    cart_product: {
                        id_subcategory: dataSub._id,
                        subcategory_quantity:1
                    }
                }).save()
                
                const result = {
                    ...insertCart._doc,
                    cart_product: {
                        ...insertCart._doc.cart_product,
                        subcategory_export_price: dataSub.subcategory_export_price,
                        subcategory_discount: dataSub.subcategory_discount,
                        subcategory_vat: dataSub.subcategory_vat,
                        subcategory_ck: dataSub.subcategory_ck,
                        subcategory_warranty: dataSub.subcategory_warranty,
                        subcategory_unit: dataSub.subcategory_unit,
                        subcategory_images: dataSub.subcategory_images,
                    }
                }
                return res.json(result)
            }
        }
        catch(e)
        {
            console.log(e)
            return res.status(500).send("Thất bại! Có lỗi xảy ra")
        } 
    })
    //#endregion api lấy danh sách chức năng và nhóm người dùng
}


export const update = async(app)=>{
    //#region api lấy danh sách chức năng và nhóm người dùng
    app.put(prefixApi, helper.authenToken, async (req, res) => {
        try {
            const id_cart = req.body.id_cart
            const subcategory_quantity = validator.tryParseInt(req.body.subcategory_quantity) <= 0?1:validator.tryParseInt(req.body.subcategory_quantity)
            const dataCart = await ModelCart.findById(id_cart)
            if (!dataCart) return res.status(400).send("Thất bại! Có lỗi xảy ra")
            dataCart.cart_product.subcategory_quantity = subcategory_quantity
            const updateCart = await ModelCart.findByIdAndUpdate(dataCart._id, {
                cart_product:dataCart.cart_product
            })
            return res.json(updateCart)
        }
        catch (e) {
            console.log(e)
            return res.status(500).send("Thất bại! Có lỗi xảy ra")
        }
        
    })
    //#endregion api lấy danh sách chức năng và nhóm người dùng
}


export const deleteCart = async(app)=>{
    //#region api lấy danh sách chức năng và nhóm người dùng
    app.delete(prefixApi+"/:id_cart", helper.authenToken, async (req, res) => {
        try {
            const id_cart = req.params.id_cart
            const dele = await ModelCart.findByIdAndDelete(id_cart)
            return res.json(dele)
        }
        catch (e) {
            console.log(e)
            return res.status(500).send("Thất bại! Có lỗi xảy ra")
        }
        
    })
    //#endregion api lấy danh sách chức năng và nhóm người dùng
}

