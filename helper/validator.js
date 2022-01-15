//var/www/gmkho/html/helper
import mongoose from "mongoose";
import * as helper from "./helper.js";
export const ObjectId = mongoose.Types.ObjectId;
const isDebug = true;
//parse time
import * as date_fns from "date-fns";
const start_of_day = date_fns.startOfDay;
const end_of_day = date_fns.endOfDay;
const start_of_week = date_fns.startOfWeek;
const end_of_week = date_fns.endOfWeek;
const start_of_month = date_fns.startOfMonth;
const start_of_year = date_fns.startOfYear;
const compare_asc = date_fns.compareAsc; //so sánh nếu ngày 1 < ngày 2 => return -1
const format_ISO = date_fns.formatISO;
//id function
import sanitize from "mongo-sanitize";
import { unlink } from 'fs/promises';
//
const maxNumber = 10000000000;
const minNumber = -10000000000;
const maxLength = 10000;
const limit_query = 100;
//
//#region check validate
//limit - page
export const URL_IMAGE_CATEGORY = 'public/images/images_category'

export const isDefine = function (val) {
    try {
        if (val == undefined || val == `undefined` || val == null || val == `null` || val.toString().length == 0) return false;
        return true;
    } catch (err) {
        return false;
    }
};

//check empty
export const isNotEmpty = function (val) {
    try {
        if (val == undefined || val == `undefined` || val == null || val == `null` || val.toString().length == 0) return false;
        return true;
    } catch (err) {
        return false;
    }
};

//valid date
export const isValidDate = (dateObject) => {
    return new Date(dateObject).toString() !== "Invalid Date";
};
//check object id
export const isObjectId = (id) => {
    if (isNotEmpty(id)) {
        return ObjectId.isValid(id);
    } else {
        return false;
    }
};
//number

//check boolean
export const isBoolean = function (val) {
    if (typeof val == "boolean") {
        return true;
    } else {
        return false;
    }
};
//json
export const isJson = (item) => {
    if (isArray(item)) return true;

    item = typeof item !== "string" ? JSON.stringify(item) : item;

    try {
        item = JSON.parse(item);
    } catch (e) {
        return false;
    }

    if (typeof item === "object" && item !== null) {
        return true;
    }

    return false;
};
//array
function isArray(val) {
    try {
        return Array.isArray(val);
    } catch (e) {
        throwError(e);
        return false;
    }
}
//#endregion check validate ===============================================================
//#region log
export const throwError = (e) => {
    if (isDebug && e) {
        console.error(e);
    }
};
export const throwValue = (val) => {
    if (isDebug && val) {
        console.log(val);
    }
};
//#endregion check los ===============================================================
//#region parse
export const tryParseInt = function (str) {
    try {
        if (!isDefine(str)) return 0;
        return parseInt(str.toString().replaceAll(",", "")) || 0;
    } catch (e) {
        return 0;
    }
};

export const tryParseFloat = function (str) {
    try {
        if (!isDefine(str)) return 0;
        return parseFloat(str.toString()) || 0;
    } catch (e) {
        return 0;
    }
};
export const tryParseJson = function (str) {
    if (!isDefine(str)) return null;
    try {
        if (isJson(str)) {
            try {
                return JSON.parse(str);
            } catch (e) {
                return str;
            }
        }
        return JSON.parse(str.toString());
    } catch (e) {
        helper.throwError(e);
        return null;
    }
};

export const tryParseBoolean = (str) => {
    if (isNotEmpty(str)) {
        switch (str.toLowerCase().trim()) {
            case "true":
            case "yes":
            case "1":
                return true;
            case "false":
            case "no":
            case "0":
                return false;
            default:
                return Boolean(str);
        }
    } else {
        return false;
    }
};
//#endregion parse ===============================================================
//#region helper
var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
    "/": "&#x2F;",
    "`": "&#x60;",
    "=": "&#x3D;",
};
function escapeHtml(string) {
    string = string + "";
    if (!isNotEmpty(string)) return "";
    if (string.includes("<script>")) {
        return String(string).replace(/[&<>"'`=\/]/g, function (s) {
            return entityMap[s];
        });
    } else {
        return string;
    }
}
function capitalizeFirstLetter(string) {
    if (isDefine(string)) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    } else {
        return null;
    }
}

function empty(val) {
    // test results
    //---------------
    // []        true, empty array
    // {}        true, empty object
    // null      true
    // undefined true
    // ""        true, empty string
    // ''        true, empty string
    // 0         false, number
    // true      false, boolean
    // false     false, boolean
    // Date      false
    // function  false

    if (val === undefined) return true;

    if (typeof val == "function" || typeof val == "number" || typeof val == "boolean" || Object.prototype.toString.call(val) === "[object Date]") return false;

    if (val == null || val.length === 0)
        // null or 0 length array
        return true;

    if (typeof val == "object") {
        // empty object

        var r = true;

        for (var f in val) r = false;

        return r;
    }

    return false;
}
function setSlug(value) {
    return stringToSlug(value)
}

export const stringToSlug = function (str) {
    // remove accents
    if (empty(str)) return null;
    var from = "àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ",
        to = "aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy";
    for (var i = 0, l = from.length; i < l; i++) {
        str = str.replace(RegExp(from[i], "gi"), to[i]);
    }

    str = str
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\-]/g, "-")
        .replace(/-+/g, "-");

    return str;
};
//làm tròn số
function decimalAdjust(type, value, exp) {
    try {
        if (!isNotEmpty(value)) return false;
        // If the exp is undefined or zero...
        if (typeof exp === "undefined" || +exp === 0) {
            return Math[type](value);
        }
        value = +value;
        exp = +exp;
        // If the value is not a number or the exp is not an integer...
        if (isNaN(value) || !(typeof exp === "number" && exp % 1 === 0)) {
            return NaN;
        }
        // Shift
        value = value.toString().split("e");
        value = Math[type](+(value[0] + "e" + (value[1] ? +value[1] - exp : -exp)));
        // Shift back
        value = value.toString().split("e");
        return +(value[0] + "e" + (value[1] ? +value[1] + exp : exp));
    } catch (err) {
        throwError(err);
        return false;
    }
}
// Decimal round
export const round2 = (value) => decimalAdjust("round", value, -2);
export const round = (value) => decimalAdjust("round", value, 0);
// Decimal làm tròn xuống
export const floor2 = (value) => decimalAdjust("floor", value, -2);
// Decimal làm tròn lên
export const ceil2 = (value) => decimalAdjust("ceil", value, -2);
export const ceil = (value) => decimalAdjust("ceil", value, 0);

export const toFixed2 = (val) => {
    try {
        if (!isDefine(val)) return false;
        return Number.parseFloat(val).toFixed(2);
    } catch (err) {
        throwError(err);
        return false;
    }
};
//xuống chữ thường
export const toLowerCase = (str) => {
    return escapeHtml(str).toLocaleLowerCase();
};

export const getOnlyNumber = function (str) {
    var num = str.replace(/[^0-9]/g, "");
    return num;
};
//#endregion helper ===============================================================
//#region date time helper

export const tryParseISODate = (dateObject) => {
    if (isValidDate(dateObject)) {
        return new Date(dateObject).toISOString();
    } else {
        return new Date.now.toISOString();
    }
};
export const tryParseUTCDate = (dateObject) => {
    if (isValidDate(dateObject)) {
        return new Date(dateObject).toUTCString();
    } else {
        return new Date.now.toUTCString();
    }
};


export const compareAsc = (date1, date2) => {
    return compare_asc(new Date(date1), new Date(date2));
};
export const startOfDay = (val) => {
    return start_of_day(new Date(val));
};
export const endOfDay = (val) => {
    return end_of_day(new Date(val));
};
export const startOfWeek = (val) => {
    return start_of_week(new Date(val), { weekStartsOn: 1 });
};
export const endOfWeek = (val) => {
    return end_of_week(new Date(val), { weekStartsOn: 1 });
};
export const startOfMonth = (val) => {
    return start_of_month(new Date(val));
};
export const startOfYear = (val) => {
    return start_of_year(new Date(val));
};
export const next_day = (val) => {
    return new Date(new Date(val).setDate(new Date(val).getDate() + 1)).toISOString();
};
function padValue(value) {
    return value < 10 ? "0" + value : value;
}
export const time_now = () => {
    const d = new Date();
    return {
        fulltime: `${d.getFullYear()}${padValue(d.getMonth() + 1)}${padValue(d.getDate())}${padValue(d.getHours())}${padValue(d.getMinutes())}${padValue(d.getSeconds())}`,
        sorttime: `${padValue(d.getMonth() + 1)}${padValue(d.getDate())}${padValue(d.getHours())}${padValue(d.getMinutes())}${padValue(d.getSeconds())}`,
    };
};
export const timeString = () => {
    const current = new Date();
    return {
        fulldate: addZero(current.getFullYear()) + "-" + addZero(current.getMonth() + 1) + "-" + addZero(current.getDate()),
        startOfDay: new Date(current.getFullYear() + "-" + addZero(current.getMonth() + 1) + "-" + addZero(current.getDate()) + " 00:00:00"),
        endOfDay: new Date(current.getFullYear() + "-" + addZero(current.getMonth() + 1) + "-" + addZero(current.getDate()) + " 23:59:59"),
    };
};
export const dateTimeZone = (timezone = "GMT +07:00") => {
    const time = timezone.replace("UTC", "").replace("GMT", "").replace("GTM", "").trim().split(":");
    const timeZonemHours = tryParseInt(time[0]) * 60;
    const timeZoneminutes = tryParseInt(time[0]) < 0 ? -1 * tryParseInt(time[1]) : tryParseInt(time[1]);
    const current = Date.now() + (timeZonemHours + timeZoneminutes) * 60 * 1000;
    const now = new Date(current);
    return {
        currentTime: now,
        hours: now.getHours(),
        minutes: now.getMinutes(),
        seconds: now.getSeconds(),
        fullyear: now.getFullYear(),
        month: now.getMonth() + 1,
        date: now.getDate(),
        scheduleNow: { hours: now.getHours(), minutes: now.getMinutes(), seconds: now.getSeconds() },
        startOfDay: new Date(now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + addZero(now.getDate()) + " 00:00:00"),
        endOfDay: new Date(now.getFullYear() + "-" + addZero(now.getMonth() + 1) + "-" + addZero(now.getDate()) + " 23:59:59"),
    };
};
export const isChecked = (time) => {
    if (time.hours == 0 && time.minutes == 0 && time.seconds == 0) return false;
    return true;
};
export const addZero = (number, length = 2) => {
    var my_string = "" + number;
    while (my_string.length < length) {
        my_string = "0" + my_string;
    }
    return my_string;
};
//#endregion date time helper ===============================================================

//#region schema
function setNumber(num) {
    return tryParseInt(num);
}

function getNumber(num) {
    //return fm.from(num, true);
    return num;
}
function setMoneyVi(money) {
    return tryParseInt(money);
}
function getMoneyVi(money) {
    //return fm.from(money, true);
    return money;
}
function setMoneyEn(money) {
    return tryParseFloat(money);
}
function getMoneyEn(money) {
    //return fm.from(money, true);
    return money;
}
function setMoney(money) {
    return tryParseFloat(money);
}

function getMoney(money) {
    //return fm.from(money, true);
    return money;
}
function setJsonObject(json) {
    return tryParseJson(json);
}
function setJsonArray(json) {
    const results = tryParseJson(json);

    if (isArray(results)) {
        return results;
    }
    return [];
}
export const trySanitiza = (str) => {
    return str;
};
export const validatorFOAD = {
    runValidators: true,
    new: true,
    returnNewDocument: true,
    returnOriginal: false,
};
export const schemaNumber = {
    type: Number,
    default: 0,
    trim: true,
    min: minNumber,
    max: maxNumber,
    set: setNumber,
    get: getNumber,
};
export const schemaMoney = {
    type: Number,
    default: 0,
    trim: true,
    min: 0,
    max: maxNumber,
    set: setMoney,
    get: getMoney,
};
export const schemaMoneyVi = {
    type: Number,
    default: 0,
    trim: true,
    min: 0,
    max: maxNumber,
    set: setMoneyVi,
    get: getMoneyVi,
};
export const schemaMoneyEn = {
    type: Number,
    default: 0,
    trim: true,
    min: 0,
    max: maxNumber,
    set: setMoneyEn,
    get: getMoneyEn,
};
export const schemaMoneyVi_negative = {
    type: Number,
    default: 0,
    trim: true,
    min: minNumber,
    max: maxNumber,
    set: setMoneyVi,
    get: getMoneyVi,
};
export const schemaMoneyEn_negative = {
    type: Number,
    default: 0,
    trim: true,
    min: minNumber,
    max: maxNumber,
    set: setMoneyEn,
    get: getMoneyEn,
};
export const schemaCapitalizeFirstLetter = {
    set: capitalizeFirstLetter,
};
export const schemaString = {
    type: String,
    trim: true,
    default: null,
    maxLength: maxLength,
};

export const schemaObjectId = {
    type: ObjectId,
    trim: true,
    default: null,
    maxLength: maxLength,
    index:true
};
export const schemaDatetime = {
    type: Date,
    trim: true,
    default: Date.now,
    maxLength: maxLength,
    index: true,
    sparse: true,
};
export const schemaUnique = {
    unique: true,
};
export const schemaRequired = {
    required: true,
};
export const schemaPoint = {
    type: {
        type: String,
        enum: ["Point"],
        required: true,
    },
    coordinates: {
        type: [Number],
        required: true,
    },
};
export const schemaJson = {
    type: JSON,
    trim: true,
    default: null,
    maxLength: 10000,
    set: setJsonObject,
};
export const schemaArray = {
    type: Array,
    trim: true,
    default: [],
    maxLength: 10000,
    set: setJsonArray,
};
export const schemaIndex = {
    index: true,
    sparse: true,
};
export const schemaAutoIndex = { // đánh inđex
    // autoIndex: true,
    index: true,
    sparse: true,
};


export const schemaBoolean = {  
    type: Boolean,
    default: true,
};

export const schemaBooleanFalse = {  //
    type: Boolean,
    default: false,
};

export const schemaTextIndex = { // tìm kiếm text
    text: true,
    sparse: true,
};

export const schemaImmutable = {  //không thay đổi
    immutable: true,
};
//
export const schemaSlugLink = {
    text:true,
    set: setSlug,
}

export const sortDES = {
    _id: -1,
};


export const schemaSchedule = {
    hours: {
        type: Number,
        required: true,
        min: 0,
        max: 23,
        default: 0,
    },
    minutes: {
        type: Number,
        default: 0,
        min: 0,
        max: 59,
        required: true,
    },
    seconds: {
        type: Number,
        default: 0,
        min: 0,
        max: 59,
        required: true,
    },
};

export const schemaProduct = {
    id_subcategory: {
        type: ObjectId,
        required:true
    },
    id_product:{
        type: ObjectId,
    },
    money_import_notvat:{
        type: Number,
        default:0
    },
    id_product2:{
        type: String
    },
    subcategory_name:{
        type: String,
        text: true,
    },
    export_price:{
        type: Number,
        default:0
    },
    subcategory_discount:{
        type: Number,
        default:0
    },
    subcategory_vat:{
        type: Number,
        default:0
    },
    subcategory_ck:{
        type: Number,
        default:0
    },
    subcategory_part:{
        type: Number,
        default:0
    },
    subcategory_warranty:{
        type: Number,
        default:0
    },
    subcategory_point:{
        type: Number,
        default:0
    },
    quantity:{
        type: Number,
        default:0
    },
    id_employee:{
        type: ObjectId
    },
    employee_fullname:{
        type: String
    },
    index:{
        type: Number,
        default:0
    },
    status_proposal:{
        type: String,
        default:"Chưa đề xuất"
    },
    note:{
        type: String,
        default:null
    },
    image:{
        type: String,
        default:null
    }

}
//#endregion schema ===============================================================


export const  schePre = (Schema) => 
{
    Schema.index({ createdAt: 1 });
    Schema.index({ updatedAt: 1 });
    
    Schema.pre(['find', 'findOne', 'findById' ], async function(next) {
        this.lean()
        return next()
    })
    
    Schema.pre(['findOneAndUpdate','findByIdAndUpdate'], async function(next) {
        this.options.runValidators = true
        this.options.new = true
        this.lean()
        return next()
    })
    
    
    Schema.pre(['updateOne', 'updateMany'], async function(next) {
        this.options.runValidators = true
        this.options.new = true
        return next()
    })


    // Schema.post(['find'], async function(docs, next) {
    //     return next(docs)
    // })
    
}



// export const limitQuery = function (limit) {
//     limit = tryParseInt(limit)
//     limit = Math.min(limit, limit_query)
//     if (limit <= 0) limit = 10
//     return limit
// }

// export const skipQuery = function (limit, page) {
//     limit = limitQuery(limit)
//     return limit * (Math.max(tryParseInt(page), 1) - 1)
// }

// export const sortQuery = function (req) {
//     let sort = {}
//     if (isDefine(req.query.sort)) {
//         var arrSort = req.query.sort
//         for(let i =0; i<arrSort.length;i++)
//         {
//             Object.keys(arrSort[i]).map(key=>
//                 {
//                     sort = {
//                         ...sort,
//                         [key]: parseInt(arrSort[i][key])
//                     }
//                 })
//         }
//     }
//     return sort
// }

// export const query = function (req) {
//     var query = {}
//     Object.keys(req.query).map( key =>
//         {
//             if(key != 'limit'  && key != 'page' && key != 'offset' && key != 'getOther')
//             {
//                 if(ObjectId.isValid(req.query[key]))
//                 {
//                     query = {
//                         ...query, [key]:req.query[key]
//                     }
//                 }
//                 else if(! isNaN(parseInt(req.query[key])))
//                 {
//                     query = {
//                         ...query, [key]:parseInt(req.query[key])
//                     }
//                 }
//                 else
//                 {
//                     query = {
//                         ...query, [key]:{$regex:".*"+req.query[key]+".*", $options:"$i"}
//                     }
//                 }
//             }
//         })
   
//     return query
// }

// export const resultAPI = function (docs, total, limit, page) {
//     return {
//         total: total,
//         limit: limit,
//         page: page / limit + 1,
//         data: docs,
//     }
// }
export const isNumber = function (variable, is_different_type = false) {
    if (is_different_type) {
        return !isNaN(variable)
    } else {
        return typeof variable == "number"
    }
}


// export const setNewValue = (req)=>{
//     var value = {}
//     Object.keys(req.body).map( key =>{
//         value = {
//             ...value,
//             key :req.body[key]
//         }
//     })
//     return value

// }
// //#region
// class mideware {
//     constructor(req, res , objectModel) {
//         this.req = req
//         this.res = res
//         this.objectModel = objectModel
//     }

//     setParams(req, res,objectModel) {
//         this.req = req
//         this.res = res
//         this.objectModel = objectModel

//     }

//     async handleInsert() {
//         try
//         {
//             const value = setNewValue(this.req)
//             const insertNew = await new this.objectModel(value).save()
//             return this.res.json(insertNew)
//         }
//         catch(e)
//         {
//             console.log(e)
//             return this.res.status(500).send("Thất bại! Có lỗi xảy ra")
//         }
//     }

//     async createDoc(files) {
//         try {
//             const object = this.getFieldsOfRequest(this.req)
//             object.files = files

//             return this.res.json(await new this.objectModel(object).save())
//         } catch (err) {
//             this.throwError(err, this.req, this.res)
//         }
//     }

//     // async handleUpdate() {
//     //     // storager.uploadFile(this.req, this.res, (files) => {
//     //     //     this.updateDoc(files)
//     //     // })

//     // }

//     // async updateDoc(files) {
//     //     try {
//     //         const object = await this.objectModel.findByIdAndUpdate(helper.sanitize(this.req.params.objectId), { $set: this.getFieldsOfRequest(this.req), $push: { files: { $each: files } } })
//     //         return this.res.json(object)
//     //     } catch (err) {
//     //         this.throwError(err, this.req, this.res)
//     //     }
//     // }

//     // async handleRemoveImage() {
//     //     const objForUpdate = { $pull: { files: helper.sanitize(this.req.body.name_file) } }
//     //     const object = await this.objectModel.findByIdAndUpdate(helper.sanitize(this.req.params.objectId), objForUpdate)

//     //     storager.removeFile(this.req, () => {
//     //         return this.res.json(object)
//     //     })
//     // }

//     async handleFind(count=true) {
//         const limit = limitQuery(this.req.query.limit)
//         const page = skipQuery(this.req.query.limit, this.req.query.page)
//         const sort = sortQuery(this.req)
//         const squery = query(this.req)
//         const data = await this.objectModel.find(squery).sort(sort).limit(limit).skip(page)
//         var total = 0
//         if(count)
//         {
//           total = await this.objectModel.countDocuments(squery)
         
//         }
//         return {
//             data:data, 
//             count: total 
//         }
//     }
    
//     async findById(id=this.req.query._id) {
//         const data = await this.objectModel.findById(id)
//         return this.res.json(data)
//     }
// }
// //#endregion
// export default mideware ;


export const getLimit = (req)=>
{
    var limit = 10;
    
    if( isDefine(req.query.limit) )
    {
        limit = parseInt(req.query.limit)
        if(isNaN(limit) || limit < 0)
        {
            limit = 10
        }
    }
    return limit
}

export const getOffset = (req)=>
{

    var page = 1;
    if( isDefine(req.query.page) )
    {
        page = parseInt(req.query.page)
        if(isNaN(page) || page < 0)
        {
            page = 1
        }
    }
    return (page-1)*getLimit(req)
}

export const removeFile = async (url)=>
{
    await unlink(url);
}