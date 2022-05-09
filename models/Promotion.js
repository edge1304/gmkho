import mongoose from "mongoose"
import * as validator from "./../helper/validator.js"


const SchemaPromotion = new mongoose.Schema({  // cái này dành cho trang gm feed trên mobile phần khuyến mại
    promotion_images:
    {
        type:[],
        default:[]
    },
    promotion_content:{
        ...validator.schemaString
    },
    promotion_url:{
        ...validator.schemaString
    },
    promotion_title:{
        ...validator.schemaString,
        ...validator.schemaTextIndex,
        ...validator.schemaRequired
    }

},{timestamps: true });



validator.schePre(SchemaPromotion)
export const  ModelPromotion = mongoose.model("Promotion",SchemaPromotion);