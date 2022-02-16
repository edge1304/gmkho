import mongoose from "mongoose";
import * as validator from "./../helper/validator.js";
const schemaProduct = new mongoose.Schema({
    id_subcategory: {
        type: validator.ObjectId,
        required: true,
    },
    id_product2: {
        type: String,
        default:null
    },
    subcategory_name: {
        type: String,
        default:null
    },
    product_import_price: {
        type: Number,
        default:0
    },
    product_import_price_return: {
        type: Number,
        default:0
    },
    product_vat: {
        type: Number,
        default:0
    },
    product_ck: {
        type: Number,
        default:0
    },
    product_discount: {
        type: Number,
        default:0
    },
    product_quantity: {
        type: Number,
        default:1
    },
    product_warranty: {
        type: Number,
        default:0
    },
    product_index: {
        type: Number,
        default:0
    }
})
const SchemaImportForm = new mongoose.Schema(
    {
        id_warehouse:{  // mã kho
            ...validator.schemaObjectId,
            ...validator.schemaRequired
        },
        id_employee:{  // mã nhân viên
            ...validator.schemaObjectId,
            ...validator.schemaRequired
        },
        id_user:{  // mã nhà cung cập hoặc khách hàng
            ...validator.schemaObjectId,
        },
        import_form_status_paid:{...validator.schemaBooleanFalse},  // trạng thái thanh đoán , false là chưa thanh toán
        import_form_product: {
            ...validator.schemaJson,
            type: [schemaProduct]
        },  // json sản phẩm
        import_form_note:{...validator.schemaString},  // ghi chú
        import_form_type:{
            ...validator.schemaString,
            ...validator.schemaRequired
        },  //loại phiếu
    },
    { timestamps: true }
);

validator.schePre(SchemaImportForm)
export const ModelImportForm = mongoose.model("ImportForm", SchemaImportForm);
