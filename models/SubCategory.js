import mongoose from "mongoose";
import * as validator from "./../helper/validator.js";

const schemaSubCategory = new mongoose.Schema({
    subcategory_name: {  
        ...validator.schemaString,
        ...validator.schemaRequired,
        ...validator.schemaUnique,       
    },
    subcategory_replace_name: {  
        ...validator.schemaString,
        ...validator.schemaUnique,       
    }, 
    subcategory_text_search: {  
        ...validator.schemaString,
        ...validator.schemaTextIndex, 
    },
    id_category: {
        ...validator.schemaObjectId,
        ...validator.schemaIndex,
        ...validator.schemaRequired,
    },
    subcategory_status: {
        ...validator.schemaNumber, // trạng thái sản phẩm ,xác định đã có trên web hay chưa 0 là chưa , 1 là lên , -1 là đang ẩn
    },
    subcategory_slug_link: {  // slug link
        ...validator.schemaString,
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
    subcategory_seo_description:{  // seo ảnh
        ...validator.schemaString,
    },
    subcategory_sale_status:{  // trạng thái sale
        ...validator.schemaArray,
    },
    subcategory_content:{  // nội dung hiển thị
        ...validator.schemaString,
    },
    subcategory_related:{  // nội dung hiển thị
        ...validator.schemaArray,
    },
    id_combo_warranty: {  // mã combo bảo hành
        ...validator.schemaString,
        // ...validator.schemaIndex,
    },
    id_combo_promotion: {  // mã combo khuyến mãi
        ...validator.schemaString,
        // ...validator.schemaIndex,
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
    },
    subcategory_stt:{ // link video
        ...validator.schemaNumber
    },
    subcategory_options:{ // link video
        ...validator.schemaJson
    },
    subcategory_warehouses:{ // mảng chu nhánh số lượng tồn
        ...validator.schemaArray
    }

}, { timestamps: true })

validator.schePre(schemaSubCategory)

schemaSubCategory.pre(['findByIdAndUpdate','findOneAndUpdate'], async function(next) {
    this.subcategory_text_search = validator.stringTextSearch(this.subcategory_name)
    this.subcategory_slug_link = validator.stringToSlug(this.subcategory_name)
    return next()
})


schemaSubCategory.pre(['save','insertManey'], async function(next) {
    this.subcategory_replace_name = this.subcategory_name,
    this.subcategory_text_search = validator.stringTextSearch(this.subcategory_name)
    this.subcategory_slug_link = validator.stringToSlug(this.subcategory_name)
    return next()
})


export const ModelSubCategory = mongoose.model("SubCategory", schemaSubCategory)