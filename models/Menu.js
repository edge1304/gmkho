import mongoose from "mongoose";
import * as validator from "./../helper/validator.js";
const SchemaMenu = new mongoose.Schema(
    {
        menu_name:{
            ...validator.schemaString,
            ...validator.schemaRequired,
            ...validator.schemaTextIndex, 
        },
        menu_content:
        {
            ...validator.schemaArray
        },
        menu_type:  // mặc định có 2 kiểu category và supercategory
        {
            ...validator.schemaString
        }
    },
    { timestamps: true }
);
validator.schePre(SchemaMenu)
export const ModelMenu = mongoose.model("Menu", SchemaMenu);
