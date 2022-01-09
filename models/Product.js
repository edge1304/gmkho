import mongoose from "mongoose";
import * as validator from "./../helper/validator.js";
const SchemaProduct = new mongoose.Schema(
    {
        product_id2: {  // mã 2 của sản phẩm
            ...validator.schemaString,
            ...validator.schemaTextIndex,
            ...validator.schemaUnique
        },// tên nhân viên
        id_subcategory:{
            ...validator.schemaObjectId,
            ...validator.schemaRequired
        },
        id_warehouse:{
            ...validator.schemaObjectId,
            ...validator.schemaRequired
        },
        id_import_form:{  // mã phiếu nhập lần đầu tiên
            ...validator.schemaObjectId,
            ...validator.schemaRequired
        },
        product_index:{ // số thứ tự sản phẩm trong phiếu nhập lần đầu tiên
            ...validator.schemaNumber,
            ...validator.schemaRequired
        },
        product_status:{ //  trạng thái tồn của sản phẩm / true đã xuất / false chưa xuất
            ...validator.schemaBooleanFalse
        },
        id_export_form:{ // mã phiếu xuất mới nhất, giúp tìm kiếm bảo hành nhanh chóng hơn
            ...validator.schemaObjectId, 
        },
    },
    { timestamps: true }
);

SchemaProduct.index({ createdAt: 1 });
SchemaProduct.index({ updatedAt: 1 });

validator.schePre(SchemaProduct)
export const ModelProduct = mongoose.model("Product", SchemaProduct);
