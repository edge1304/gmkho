import mongoose from "mongoose"
import * as validator from "./../helper/validator.js"
const SchemaBranch = new mongoose.Schema({
	branch_name: validator.schemaString,
	branch_address: validator.schemaString,
	branch_phone:{
		...validator.schemaString,
		...validator.schemaRequired,
		...validator.schemaIndex,
	},
	branch_image: {
		...validator.schemaString
	},
	branch_header_content:{
		...validator.schemaString
	},
	branch_ipwifi:{
		...validator.schemaString
	},
	branch_logo:{
		...validator.schemaString
	},
	branch_note:{
		...validator.schemaString
	}

},{timestamps: true });

SchemaBranch.index({"createdAt": 1})
SchemaBranch.index({"updatedAt": 1})

validator.schePre(SchemaBranch)

export const  ModelBranch = mongoose.model("Branch",SchemaBranch);