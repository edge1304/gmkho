import mongoose from "mongoose";
import * as validator from "./../helper/validator.js";
const SchemaNews = new mongoose.Schema(
    {
        news_title:{
            ...validator.schemaString,
            ...validator.schemeRequired,
            ...validator.schemaTextIndex
        },
        news_image:{
            ...validator.schemaString,
            ...validator.schemeRequired
        },
        news_content:{
            ...validator.schemaString,
            ...validator.schemeRequired
        },
        
    },
    { timestamps: true }
);
validator.schePre(SchemaNews)
export const ModelNews = mongoose.model("News", SchemaNews);
