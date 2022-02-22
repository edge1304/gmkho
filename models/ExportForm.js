import mongoose from "mongoose";
import * as validator from "./../helper/validator.js";
// import {update_status_voucher} from './../api/ControllerVoucher/index.js'
// import {ModelProduct} from './Product.js'
const SchemaProductExportForm = new mongoose.Schema(
    {
        id_product: {
            ...validator.schemaObjectId,
            ...validator.schemaRequired
        },
        id_product2: {
            ...validator.schemeString
        },
        id_subcategory: {
            ...validator.schemaObjectId,
            ...validator.schemaRequired
        },
        subcategory_name: {
            ...validator.schemaString,
            ...validator.schemaRequired
        },
        product_export_price: {
            ...validator.schemaNumber
        },
        product_vat: {
            ...validator.schemaNumber
        },
        product_ck: {
            ...validator.schemaNumber
        },
        product_discount: {
            ...validator.schemaNumber
        },
        product_quantity: {
            ...validator.schemaNumber,
            default:1
        },
        product_warranty: {
            ...validator.schemaNumber,
        },
        subcategory_point: {
            ...validator.schemaNumber,
            ...validator.schemaRequired

        },
        subcategory_part: {
            ...validator.schemaNumber,
            ...validator.schemaRequired

        },
        id_employee: {
            ...validator.schemaObjectId,
        },
    }
);

const SchemaExportForm = new mongoose.Schema(
    {
        id_warehouse:{
            ...validator.schemaObjectId,
            ...validator.schemaRequired
        },

        id_employee:{
            ...validator.schemaObjectId,
            ...validator.schemaRequired
        },
        id_user:{
            ...validator.schemaObjectId,
            ...validator.schemaRequired
        },

        export_form_status_paid:{...validator.schemaBooleanFalse},
        export_form_product: {
            ...validator.schemaArray,
            type:[SchemaProductExportForm]
        },
        export_form_note:{...validator.schemeString},
        export_form_type:{...validator.schemeString},
        
        voucher_code: {
            ...validator.schemeString
        },
        money_voucher_code: {
            ...validator.schemeNumber
        },
        point_number: {
            ...validator.schemeNumber
        },
        subcategory_part: {
            ...validator.schemeNumber
        },
        money_point: {
            ...validator.schemeNumber
        },
    },
    { timestamps: true }
);


validator.schePre(SchemaExportForm)

// SchemaExportForm.post(['save', 'insertMany','insertOne'], async (docs) => {

//     if (Array.isArray(docs)) {
//         await Promise.all(  docs.map(async form => {
//             await updateProduct(form.export_form_product , form._id)
//             if (form.voucher_code) {
//                 await update_status_voucher(form.voucher_code)
//             }
//         }))
//     }
//     else {
//         await updateProduct(docs.export_form_product, docs._id)
//         if (docs.voucher_code) {
//             await update_status_voucher(docs.voucher_code)
//         }
//     }
    
// })
// const updateProduct = async (arrProduct , id_export_form) => {
//     for (let i = 0; i < arrProduct.length; i++){
//         await ModelProduct.findByIdAndUpdate(arrProduct[i].id_product,{product_status:true, product_warranty: arrProduct[i].product_warranty ,id_export_form: id_export_form})
//     }
// }


export const ModelExportForm = mongoose.model("ExportForm", SchemaExportForm);
