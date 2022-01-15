import mongoose from "mongoose";
import * as validator from "./../helper/validator.js";
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
        import_form_money_paid:{...validator.schemaNumber}, // số tiền đã trả cho nhà cc
        import_form_status_paid:{...validator.schemaBooleanFalse},  // trạng thái thanh đoán , false là chưa thanh toán
        import_form_product:{...validator.schemaArray},  // json sản phẩm
        import_form_note:{...validator.schemeString},  // ghi chú
        import_form_type:{
            ...validator.schemeString,
            ...validator.schemaRequired
        },  //loại phiếu
        id_payment_form:{  // mã phiếu chi
            ...validator.schemaObjectId,
        },
    },
    { timestamps: true }
);

validator.schePre(SchemaImportForm)
export const ModelImportForm = mongoose.model("Product", SchemaImportForm);
