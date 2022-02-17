const prefixApi = '/api/user';
import sanitize from "mongo-sanitize";
import * as helper from '../../helper/helper.js'
import * as validator from '../../helper/validator.js'
import { ModelUser } from '../../models/User.js'


export const getWarehouse = async (id_branch) => {
    const data = await ModelWarehouse.find({ id_branch: id_branch, warehouse_status: true })
    return data
}

export const management = async (app) => {
    app.get(prefixApi, helper.authenToken, async (req, res) => {
        try {
            if (!await helper.checkPermission("6202411e187533274b9ce427", req.body._caller.id_employee_group))
                return res
                    .status(403)
                    .send("Thất bại! Bạn không có quyền truy cập chức năng này")

            const query = { id_branch: req.body._caller.id_branch }
            if (validator.isDefine(req.query.key)) {
                const conditions = [
                    {
                        user_fullname: { $regex: sanitize(req.query.key), $options: "$i" }
                    },
                    {
                        user_phone: { $regex: sanitize(req.query.key) }
                    }
                ]
                query.$or = conditions
            }

            const data = await ModelUser.find(query).skip(validator.getOffset(req)).limit(validator.getLimit(req))
            data.forEach(element => {
                delete element.user_password
            });

            const count = await ModelUser.countDocuments(query)

            return res.json({ data, count })
        }
        catch (e) {
            console.log(e)
            return res.status(500).send("Thất bại! Có lỗi xảy ra")
        }
    })
}

export const insert = async (app) => {
    app.post(prefixApi, helper.authenToken, async (req, res) => {
        if (!await helper.checkPermission("6202411e187533274b9ce427", req.body._caller.id_employee_group))
            return res
                .status(403)
                .send("Thất bại! Bạn không có quyền truy cập chức năng này")
        try {
            const data = {
                user_fullname: req.body.user_fullname,
                user_gender: req.body.user_gender,
                user_email: req.body.user_email,
                user_password: req.body.user_password,
                user_phone: req.body.user_phone,
                user_birthday: req.body.user_birthday,
                user_address: req.body.user_address,
            }
            const create = await ModelUser(data).save()
            return res.status(201).send(create)
        }
        catch (e) {
            console.log(e)
            return res.status(500).send("Thất bại! Có lỗi xảy ra")
        }
    })
}


export const update = async (app) => {
    app.put(prefixApi, helper.authenToken, async (req, res) => {
        if (!await helper.checkPermission("6202411e187533274b9ce427", req.body._caller.id_employee_group)) return res.status(403).send("Thất bại! Bạn không có quyền truy cập chức năng này")
        try {

        }
        catch (e) {
            console.log(e)
            return res.status(500).send("Thất bại! Có lỗi xảy ra")
        }
    })
}

export const getUser = async (app) => {
    app.get(prefixApi + "/findOther", helper.authenToken, async (req, res) => {
        try {

            let query = {}
            if (validator.isDefine(req.query.key)) {
                query = {
                    $or: [{ user_fullname: { $regex: ".*" + sanitize(req.query.key) + ".*", $options: "$i" } }, { user_phone: { $regex: ".*" + sanitize(req.query.key) + ".*", $options: "$i" } }]
                }
            }
            const data = await ModelUser.find(query).skip(validator.getOffset(req)).limit(validator.getLimit(req))
            return res.json(data)
        }
        catch (e) {
            console.log(e)
            return res.status(500).send("Thất bại! Có lỗi xảy ra")
        }
    })
}
