import mongoose from "mongoose"
import * as validator from "./../helper/validator.js"
const SchemaUser = new mongoose.Schema({
    user_fullname:{
        ...validator.schemaString,
        ...validator.schemaTextIndex
    },
    user_phone:{
        ...validator.schemaString,
        ...validator.schemaTextIndex
    },
    user_password:{
        ...validator.schemaString,
    },
    user_address:{
        ...validator.schemaString,
    },
    user_point:{
        ...validator.schemaString,
    },
    user_image:{
        ...validator.schemaString,
    },
    user_gender:{
        ...validator.schemaString,
    },
    user_email:{
        ...validator.schemaString,
    }

},{timestamps: true });

SchemaUser.index({"createdAt": 1})
SchemaUser.index({"updatedAt": 1})

validator.schePre(SchemaUser);

export const  ModelCart = mongoose.model("User",SchemaUser);