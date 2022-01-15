import mongoose from "mongoose";
import * as validator from "./../helper/validator.js";
const SchemaExportForm = new mongoose.Schema(
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
        export_form_money_paid:{...validator.schemaNumber},
        export_form_status_paid:{...validator.schemaBooleanFalse},
        export_form_product:{...validator.schemaArray},
        export_form_note:{...validator.schemeString},
        export_form_type:{...validator.schemeString},
        id_fundbook:{
            ...validator.schemaObjectId,
        },
    },
    { timestamps: true }
);


validator.schePre(SchemaExportForm)
export const ModelExportForm = mongoose.model("Product", SchemaExportForm);
