const prefixApi = '/api/subcategory';
import sanitize from "mongo-sanitize";
import * as helper from '../../helper/helper.js'
import * as validator from '../../helper/validator.js'
import multer from 'multer'
import path from 'path';

import { ModelSubCategory } from '../../models/SubCategory.js'
import { ModelCategory } from '../../models/Category.js'
import { ModelInventoryWarning } from '../../models/InventoryWarning.js'
import { ModelWarehouse } from '../../models/Warehouse.js'
import { info } from "console";

export const management = async(app) => {
    //#region api lấy danh sách chức năng và nhóm người dùng
    app.get(prefixApi, helper.authenToken, async(req, res) => {
        try {
            if (!await helper.checkPermission("61e4cc4369a5d379b7a29821", req.body._caller.id_employee_group)) return res.status(403).send("Thất bại! Bạn không có quyền truy cập chức năng này")

            var arrCategory = []
            if (req.query.getOther === 'true') {
                arrCategory = await ModelCategory.find()
            }
            var query = {}
            if (validator.isDefine(req.query.key)) {
                query = {
                    ...query,
                    $or: [
                        { subcategory_name: { $regex: ".*" + sanitize(req.query.key) + ".*", $options: "$i" } },
                        { subcategory_text_search: { $regex: ".*" + sanitize(req.query.key) + ".*", $options: "$i" } },
                    ]
                }
            }
            if (validator.isDefine(req.query.id_category) && validator.ObjectId.isValid(req.query.id_category)) {
                query = {
                    ...query,
                    id_category: req.query.id_category
                }
            }
            if (validator.isDefine(req.query.subcategory_status) && !isNaN(parseInt(req.query.subcategory_status))) {
                if (parseInt(req.query.subcategory_status) >= -1 && parseInt(req.query.subcategory_status) <= 1) {
                    query = {
                        ...query,
                        subcategory_status: parseInt(req.query.subcategory_status)
                    }
                }

            }
            const data = await ModelSubCategory.find(query).sort({ _id: -1 }).skip(validator.getOffset(req)).limit(validator.getLimit(req))
            const count = await ModelSubCategory.countDocuments(query)
            return res.json({ data: data, count: count, arrCategory: arrCategory })
        } catch (e) {
            console.log(e)
            return res.status(500).send("Thất bại! Có lỗi xảy ra")
        }
    })
}

export const findOther = async(app) => {
    app.get(prefixApi + "/findOther", helper.authenToken, async(req, res) => {
        let query = {}
        if (validator.isDefine(req.query.key)) {
            query = {
                ...query,
                $or: [
                    { subcategory_name: { $regex: ".*" + sanitize(req.query.key) + ".*", $options: "$i" } },
                    { subcategory_text_search: { $regex: ".*" + sanitize(req.query.key) + ".*", $options: "$i" } },
                ]
            }
        }
        if (validator.isDefine(req.query.id_category) && validator.ObjectId.isValid(req.query.id_category)) {
            query = {
                ...query,
                id_category: req.query.id_category
            }
        }
        if (validator.isDefine(req.query.subcategory_status) && !isNaN(parseInt(req.query.subcategory_status))) {
            if (parseInt(req.query.subcategory_status) >= -1 && parseInt(req.query.subcategory_status) <= 1) {
                query = {
                    ...query,
                    subcategory_status: parseInt(req.query.subcategory_status)
                }
            }

        }
        var sort = { _id: -1 }
        const data = await ModelSubCategory.find(query).sort(sort).skip(validator.getOffset(req)).limit(validator.getLimit(req))
        return res.json(data)
    });

}
export const insert = async(app) => {
    //#region api lấy danh sách chức năng và nhóm người dùng
    app.post(prefixApi, helper.authenToken, async(req, res) => {
        try {
            if (!await helper.checkPermission("61e4cc4369a5d379b7a29821", req.body._caller.id_employee_group)) return res.status(403).send("Thất bại! Bạn không có quyền truy cập chức năng này")

            const subcategory_name = req.body.subcategory_name
            const subcategory_import_price = validator.tryParseInt(req.body.subcategory_import_price)
            const subcategory_export_price = validator.tryParseInt(req.body.subcategory_export_price)
            const subcategory_vat = validator.tryParseInt(req.body.subcategory_vat)
            const subcategory_ck = validator.tryParseInt(req.body.subcategory_ck)
            const subcategory_discount = validator.tryParseInt(req.body.subcategory_discount)
            const subcategory_warranty = validator.tryParseInt(req.body.subcategory_warranty)
            const subcategory_part = validator.tryParseInt(req.body.subcategory_part)
            const subcategory_point = validator.tryParseInt(req.body.subcategory_point)
            const subcategory_unit = req.body.subcategory_unit
            const number_warning = validator.tryParseInt(req.body.number_warning)
            const id_category = req.body.id_category
            const dataWarehouse = await ModelWarehouse.find();
            var subcategory_warehouses = []
            for (let i = 0; i < dataWarehouse.length; i++) {
                subcategory_warehouses.push({
                    id_warehouse: dataWarehouse[i]._id,
                    limit_inventory: number_warning,
                    current_inventory: 0
                })
            }
            const dataCategory = await ModelCategory.findById(id_category)
            if (!dataCategory) return res.status(400).send("Danh mục không tồn tại")
            try {
                const insertNew = await new ModelSubCategory({
                    subcategory_name: subcategory_name,
                    subcategory_import_price: subcategory_import_price,
                    subcategory_export_price: subcategory_export_price,
                    subcategory_vat: subcategory_vat,
                    subcategory_ck: subcategory_ck,
                    subcategory_discount: subcategory_discount,
                    subcategory_warranty: subcategory_warranty,
                    subcategory_part: subcategory_part,
                    subcategory_point: subcategory_point,
                    subcategory_unit: subcategory_unit,
                    id_category: id_category,
                    subcategory_warehouses: subcategory_warehouses
                }).save()

                if (!insertNew) return res.status(400).send("Thất bại! Có lỗi xảy ra")

                return res.json(insertNew)

            } catch (e) {
                console.log(e)
                return res.status(500).send("Thất bại! Có lỗi xảy ra")
            }


        } catch (e) {
            console.log(e)
            return res.status(500).send("Thất bại! Có lỗi xảy ra")
        }
    })
}


export const update = async(app) => {
    //#region api lấy danh sách chức năng và nhóm người dùng
    app.put(prefixApi, helper.authenToken, async(req, res) => {
        try {
            if (!await helper.checkPermission("61e4cc4369a5d379b7a29821", req.body._caller.id_employee_group)) return res.status(403).send("Thất bại! Bạn không có quyền truy cập chức năng này")

            const subcategory_name = req.body.subcategory_name
            const subcategory_import_price = validator.tryParseInt(req.body.subcategory_import_price)
            const subcategory_export_price = validator.tryParseInt(req.body.subcategory_export_price)
            const subcategory_vat = validator.tryParseInt(req.body.subcategory_vat)
            const subcategory_ck = validator.tryParseInt(req.body.subcategory_ck)
            const subcategory_discount = validator.tryParseInt(req.body.subcategory_discount)
            const subcategory_warranty = validator.tryParseInt(req.body.subcategory_warranty)
            const subcategory_part = validator.tryParseInt(req.body.subcategory_part)
            const subcategory_point = validator.tryParseInt(req.body.subcategory_point)
            const subcategory_unit = req.body.subcategory_unit
            const id_category = req.body.id_category
            const dataCategory = await ModelCategory.findById(id_category)
            if (!dataCategory) return res.status(400).send("Danh mục không tồn tại")

            const id_subcategory = req.body.id_subcategory
            const dataSub = await ModelSubCategory.findById(id_subcategory)
            if (!dataSub) return res.status(400).send("Thất bại! Không tìm thấy sản phẩm")
            try {
                const updateNew = await ModelSubCategory.findByIdAndUpdate(dataSub._id, {
                    subcategory_name: subcategory_name,
                    subcategory_import_price: subcategory_import_price,
                    subcategory_export_price: subcategory_export_price,
                    subcategory_vat: subcategory_vat,
                    subcategory_ck: subcategory_ck,
                    subcategory_discount: subcategory_discount,
                    subcategory_warranty: subcategory_warranty,
                    subcategory_part: subcategory_part,
                    subcategory_point: subcategory_point,
                    subcategory_unit: subcategory_unit,
                    id_category: id_category,
                })
                if (!updateNew) return res.status(400).send("Thất bại! Có lỗi xảy ra")
                return res.json(updateNew)

            } catch (e) {
                console.log(e)
                return res.status(500).send("Thất bại! Có lỗi xảy ra")
            }
        } catch (e) {
            console.log(e)
            return res.status(500).send("Thất bại! Có lỗi xảy ra")
        }
    })
}


export const addExcel = async(app) => {
    //#region api lấy danh sách chức năng và nhóm người dùng
    app.post(prefixApi + "/excel", helper.authenToken, async(req, res) => {
        try {
            if (!await helper.checkPermission("61e4cc4369a5d379b7a29821", req.body._caller.id_employee_group)) return res.status(403).send("Thất bại! Bạn không có quyền truy cập chức năng này")

            const arrExcel = req.body.arrayExcel
            const dataWarehouse = await ModelWarehouse.find()
            var subcategory_warehouses = []
            for (let i = 0; i < dataWarehouse.length; i++) {
                subcategory_warehouses.push({
                    id_warehouse: dataWarehouse[i]._id,
                    limit_inventory: 0,
                    current_inventory: 0
                })
            }
            for (let i = 0; i < arrExcel.length; i++) {
                arrExcel[i].subcategory_warehouses = subcategory_warehouses // thêm mảng kho vào sản phẩm
                arrExcel[i].subcategory_replace_name = arrExcel[i].subcategory_name

                const datasub = await ModelSubCategory.findOne({ subcategory_name: arrExcel[i].subcategory_name })
                const datacategory = await ModelCategory.findById(arrExcel[i].id_category)
                if (!datacategory) return res.status(400).send(`Thất bại! Không tìm thấy danh mục của sản phẩm ${arrExcel[i].subcategory_name} `)

                if (datasub) return res.status(400).send(`Thất bại! Sản phẩm ${arrExcel[i].subcategory_name} đã có trong hệ thống`)
                for (let j = i + 1; j < arrExcel.length; j++) {


                    if (arrExcel[i].subcategory_name == arrExcel[j].subcategory_name) {
                        arrExcel.splice(j, 1)
                        j--
                    }
                }
            }


            const insertArr = await ModelSubCategory.insertMany(arrExcel);

            return res.json(insertArr)
        } catch (e) {
            console.log(e)
            return res.status(500).send("Thất bại! Có lỗi xảy ra")
        }
    })
}


export const getDataClient = async(app) => {
    //#region api lấy danh sách chức năng và nhóm người dùng
    app.get(prefixApi + "/client", async(req, res) => {
        try {

            var query = {}
            if (validator.isDefine(req.query.key)) {
                query = {
                    ...query,
                    $or: [
                        { subcategory_name: { $regex: ".*" + sanitize(req.query.key) + ".*", $options: "$i" } },
                        { subcategory_text_search: { $regex: ".*" + sanitize(req.query.key) + ".*", $options: "$i" } },
                    ]
                }
            }
            if (validator.isDefine(req.query.id_category) && validator.ObjectId.isValid(req.query.id_category)) {
                query = {
                    ...query,
                    id_category: req.query.id_category
                }
            }
            var sort = { _id: -1 }
            if (validator.isDefine(req.query.sort) && validator.isDefine(req.query.valuesort)) {
                sort = {
                    [sanitize(req.query.sort)]: validator.tryParseInt(req.query.valuesort) }
            }
            const data = await ModelSubCategory.find(query).sort(sort).skip(validator.getOffset(req)).limit(validator.getLimit(req))
            return res.json(data)
        } catch (e) {
            console.log(e)
            return res.status(500).send("Thất bại! Có lỗi xảy ra")
        }
    })
}