import mongoose from "mongoose"
import * as validator from "./../helper/validator.js"
const SchemaFunction = new mongoose.Schema({
	function_name: {...validator.schemaString} // tên chức năng
},{timestamps: true, });

SchemaFunction.index({"createdAt": 1})
SchemaFunction.index({"updatedAt": 1})

validator.schePre(SchemaFunction)
export const  ModelFunction = mongoose.model("Function",SchemaFunction);