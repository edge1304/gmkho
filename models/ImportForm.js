import mongoose from "mongoose";
import * as validator from "./../helper/validator.js";
const SchemaImportForm = new mongoose.Schema(
    {
        id_warehouse:{
            ...validator.schemaObjectId,
            ...validator.schemaRequired
        },
        id_branch:{
            ...validator.schemaObjectId,
        },
        id_employee:{
            ...validator.schemaObjectId,
            ...validator.schemaRequired
        },
        id_user:{
            ...validator.schemaObjectId,
        },
        import_form_money_paid:{...validator.schemaNumber},
        import_form_status_paid:{...validator.schemaBooleanFalse},
        import_form_product:{...validator.schemaArray},
        import_form_note:{...validator.schemeString},
        import_form_type:{...validator.schemeString},
        id_fundbook:{
            ...validator.schemaObjectId,
        },
    },
    { timestamps: true }
);

SchemaImportForm.index({ createdAt: 1 });
SchemaImportForm.index({ updatedAt: 1 });

validator.schePre(SchemaImportForm)
export const ModelImportForm = mongoose.model("Product", SchemaImportForm);
