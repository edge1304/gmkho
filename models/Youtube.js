import mongoose from "mongoose"
import * as validator from "./../helper/validator.js"
const SchemaYoutube = new mongoose.Schema({
    youtube_index:{
        ...validator.schemaNumber
    },
    youtube_link:{
        ...validator.schemaString
    },
    youtube_id:{
        ...validator.schemaString
    }
}, { timestamps: true });


validator.schePre(SchemaYoutube);

export const ModelYoutube = mongoose.model("Youtube", SchemaVoucher);

// nếu là tiền : limit sẽ là tổng tiền phải trên
// nếu là % limit sẽ là  tổng tiền phải dưới