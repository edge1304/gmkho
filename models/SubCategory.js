import mongoose from "mongoose";
import * as validator from "./../helper/validator.js";

const schemaSubCategory = new mongoose.Schema({
    subcategory_name: {
        ...validator.schemaString,
        ...validator.schemaRequired,
        ...validator.schemaTextIndex, 
        ...validator.schemaUnique,       
    },
    id_category: {
        ...validator.schemaObjectId,
        ...validator.schemaAutoIndex,
    },
    subcategory_status: {
        ...validator.schemaNumber, // trạng thái sản phẩm ,xác định đã có trên web hay chưa 0 là chưa , 1 là lên , 2 là đang ẩn
    },
    subcategory_slug_link: {  // slug link
        ...validator.schemaString,
        ...validator.schemaRequired,
        ...validator.schemaUnique,
        ...validator.schemaSlugLink,
        ...validator.schemaIndex,
    },
    subcategory_files: {
        ...validator.schemaJson, // của sơn , không biết để làm gì
    },
    subcategory_number_like: {  // số lượng thích
        ...validator.schemaNumber,
    },
    subcategory_number_sale: {  // số lượng đã
        ...validator.schemaNumber,
    },
    subcategory_number_comment: {  // số lượng comment
        ...validator.schemaNumber,
    },
    subcategory_number_star: {  // số lượng sao
        ...validator.schemaNumber,
    },
    subcategory_import_price: { // giá nhập
        ...validator.schemaNumber,
    },
    subcategory_export_price: {  // giá xuất cũng là giá bán
        ...validator.schemaNumber,
    },
    subcategory_sale: {  // số lượng đã bán
        ...validator.schemaNumber,
    },
    subcategory_code: {
        ...validator.schemaString,
        ...validator.schemaAutoIndex,
    },
    subcategory_specifications:{
        ...validator.schemaJson
    },
    subcategory_images:{
        ...validator.schemaArray
    },
    subcategory_tags:{
        ...validator.schemaString,
    },
    subcategory_seo_meta_keyword:{
        ...validator.schemaString,
    },
    subcategory_seo_title:{
        ...validator.schemaString,
    },
    subcategory_seo_url:{
        ...validator.schemaString,
    },
    subcategory_seo_image:{  // seo ảnh
        ...validator.schemaString,
    },
    subcategory_sale_status:{  // trạng thái sale
        ...validator.schemaString,
    },
    subcategory_content:{  // nội dung hiển thị
        ...validator.schemaString,
    },
    id_combowarranty: {  // mã combo khuyến mãi
        ...validator.schemaObjectId,
        ...validator.schemaAutoIndex,
    },
    subcategory_bat:{ // bat thưởng cho nhân viên
        ...validator.schemaNumber
    },
    subcategory_vat:{ // vat của sản phẩm
        ...validator.schemaNumber
    },
    subcategory_point:{ // số điểm thưởng
        ...validator.schemaNumber
    },
    subcategory_ck:{ // chiết khấu theo % (giảm giá)
        ...validator.schemaNumber
    },
    subcategory_warranty:{ // thời gian bảo hành (tính theo tháng)
        ...validator.schemaNumber
    },
    subcategory_unit:{ // đơn vị tính
        ...validator.schemaString
    },
    subcategory_video:{ // link video
        ...validator.schemaString
    }

}, { timestamps: true })

schemaSubCategory.index({ createdAt: 1 })
schemaSubCategory.index({ updatedAt: 1 })

validator.schePre(schemaSubCategory)


export const ModelSubCategory = mongoose.model("SubCategory", schemaSubCategory)