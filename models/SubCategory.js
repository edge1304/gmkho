import mongoose from "mongoose";
import * as validator from "./../helper/validator.js";

const schemaSubCategory = new mongoose.Schema({
    subcategory_name: {  
        ...validator.schemaString,
        ...validator.schemaRequired,
        ...validator.schemaTextIndex, 
        ...validator.schemaUnique,       
    },
    subcategory_text_search: {  
        ...validator.schemaString,
        ...validator.schemaRequired,
        ...validator.schemaTextIndex, 
     
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
        ...validator.schemaTextIndex,
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
    subcategory_code: {  // mã máy
        ...validator.schemaString,
        ...validator.schemaIndex,
    },
    subcategory_specifications:{  // thông số kĩ thuật
        ...validator.schemaJson
    },
    subcategory_images:{  // mảng ảnh sản phẩm
        ...validator.schemaArray
    },
    subcategory_tags:{  // các từ khóa tìm kiếm cách nhâu bởi dấu ,sub
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
        ...validator.schemaArray,
    },
    subcategory_content:{  // nội dung hiển thị
        ...validator.schemaObjectId,
    },
    id_combo_warranty: {  // mã combo bảo hành
        ...validator.schemaObjectId,
        ...validator.schemaIndex,
    },
    id_combo_promotion: {  // mã combo khuyến mãi
        ...validator.schemaObjectId,
        ...validator.schemaIndex,
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
        ...validator.schemaString,
        default:"Chiếc"
    },
    subcategory_video:{ // link video
        ...validator.schemaString
    }

}, { timestamps: true })

validator.schePre(schemaSubCategory)


export const ModelSubCategory = mongoose.model("SubCategory", schemaSubCategory)