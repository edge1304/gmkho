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
            if (!await helper.checkPermission("6202411e187533274b9ce427", req.body._caller.id_employee_group)) return res.status(400).send("Thất bại! Bạn không có quyền truy cập chức năng này")

            let query = {}
            if(validator.isDefine(req.query.key)){
                query = {
                    ...query,
                    $or:[{user_fullname:{$regex:".*"+req.query.key+".*",$options:"$i"}},{user_phone:{$regex:".*"+req.query.key+".*"}}]
                }
            }
            const data = await ModelUser.find(query).sort({_id:-1}).skip(validator.getOffset(req)).limit(validator.getLimit(req))
            const count = await ModelUser.countDocuments(query)
         
            return res.json({data:data, count:count})
        }
        catch (e) {
            console.log(e)
            return res.status(500).send("Thất bại! Có lỗi xảy ra")
        }
    })
}

export const insert = async (app) => {
    app.post(prefixApi, helper.authenToken, async (req, res) => {
        if (!await helper.checkPermission("6202411e187533274b9ce427", req.body._caller.id_employee_group))return res.status(400).send("Thất bại! Bạn không có quyền truy cập chức năng này")
        try {
            const objectUser = JSON.parse(req.body.data)
            if(objectUser.user_phone.length == 0 || objectUser.user_fullname.length == 0 ) return res.status(400).send("Thất bại! Số điện thoại và tên khách hàng không được để trống")

            const dataUser = await ModelUser.findOne({user_phone: objectUser.user_phone.trim()})
            if(dataUser) return res.status(400).send("Thất bại! Số điện thoại đã được đăng ký")
            const insert_data = await new ModelUser(objectUser).save()
            return res.json(insert_data)
        }
        catch (e) {
            console.log(e)
            return res.status(500).send("Thất bại! Có lỗi xảy ra")
        }
    })
}


export const update = async (app) => {
    app.put(prefixApi, helper.authenToken, async (req, res) => {
        if (!await helper.checkPermission("6202411e187533274b9ce427", req.body._caller.id_employee_group)) return res.status(400).send("Thất bại! Bạn không có quyền truy cập chức năng này")
        try {
            const objectUser = JSON.parse(req.body.data)
            if(objectUser.user_phone.length == 0 || objectUser.user_fullname.length == 0 ) return res.status(400).send("Thất bại! Số điện thoại và tên khách hàng không được để trống")
            const dataUserOld = await ModelUser.findById(objectUser.id_user)
            if(!dataUserOld) return res.status(400).send("Thất bại! Không tìm thấy khách hàng cần chỉnh sửa")

            const dataUser = await ModelUser.findOne({user_phone: objectUser.user_phone.trim()})
            if(dataUser){
                if(dataUser._id.toString() != dataUserOld._id.toString()) return res.status(400).send(`Thất bại! Số điện thoại này đã được sử dụng bởi khách hàng có tên ${dataUser.user_fullname}`)
            }
            const update_user = await ModelUser.findByIdAndUpdate(dataUserOld._id,objectUser)
            return res.json(update_user)
            
        }
        catch (e) {
            console.log(e)
            return res.status(500).send("Thất bại! Có lỗi xảy ra")
        }
    })
}


export const insertMany = async (app) => {
    app.post(prefixApi + '/excel', helper.authenToken, async (req, res) => {
        if (!await helper.checkPermission("6202411e187533274b9ce427", req.body._caller.id_employee_group)) return res.status(403).send("Thất bại! Bạn không có quyền truy cập chức năng này")
        try {
            const arr_excel = JSON.parse(req.body.arr_excel)
            if(arr_excel.length == 0) return res.status(400).send("Thất bại! Hãy nhập ít nhất một sản phẩm")
            for(let i =0;i<arr_excel.length;i++){
                if(!arr_excel[i].user_phone || !arr_excel[i].user_fullname) return res.status(400).send(`Thất bại! Số điện thoại hoặc họ tên không được để trống`)
                arr_excel[i].user_phone = arr_excel[i].user_phone.trim() 
                const dataUser = await ModelUser.findOne({user_phone: arr_excel[i].user_phone})
                if(dataUser) return res.status(400).send("Thất bại! Số điện thoại đã được đăng ký")
            }
            const insert_excel = await ModelUser.insertMany(arr_excel)
            return res.json(insert_excel)
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

export const signup = async (app) => {
    app.post(prefixApi + "/signup", async (req, res) => {
        try {
          
            const user_phone = req.body.user_phone
            const dataUser = await ModelUser.findOne({ user_phone: user_phone })
            if (dataUser) return res.status(400).send("Thất bại! Số điện thoại đã được đăng kí")

            const user_fullname = req.body.user_fullname
            if (typeof (user_fullname) == 'undefined' || !user_fullname) return res.status(400).send("Thất bại! Tên người dùng không được để trống")
            const user_password = req.body.user_password
            if (typeof (user_password) == 'undefined' || !user_password) return res.status(400).send("Thất bại! Mật khẩu không được để trống")
            const insertUser = await new ModelUser({
                user_fullname: user_fullname,
                user_phone: user_phone,
                user_password: user_password,
                user_address: req.body.user_address,
                user_point: 0,
                user_image: null,
                user_gender: req.body.user_gender,
                user_email: req.body.user_email,
                user_birthday: new Date(req.body.user_birthday),
            }).save()
            delete insertUser.user_password
            console.log("đến đây")
            return res.json(insertUser)


        }
        catch (e) {
            console.log(e)
            return res.status(500).send("Thất bại! Có lỗi xảy ra")
        }

    })
}
export const signin = async (app) => {
    app.post(prefixApi + "/signin", async (req, res) => {

        try {
            const user_phone = sanitize(req.body.user_phone)
            const user_password = sanitize(req.body.user_password)
            
            if (!validator.isDefine(user_phone) || user_phone.length == 0 || !validator.isDefine(user_password) || user_password.length == 0) return res.status(400).send("Thất bại! Sai tên đăng nhập hoặc mật khẩu.")

            const dataUser = await ModelUser.findOne({ user_phone: user_phone })
            if (!dataUser) return res.status(400).send("Thất bại! Sai tên đăng nhập hoặc mật khẩu")

            if (dataUser.user_password != user_password) return res.status(400).send("Thất bại! Sai tên đăng nhập hoặc mật khẩu")

            const token = await helper.signupjwt({ ...dataUser });
            await helper.signToken(token);
            delete dataUser.user_password
            return res.json({ token: token, user: dataUser })


        }
        catch (e) {
            console.log(e)
            return res.status(500).send("Thất bại! Có lỗi xảy ra")
        }
    })
}

// export const update_client = async (app) => {
//     app.put(prefixApi, helper.authenToken, async (req, res) => {
//         const id_user = req.body._caller._id
//         try {
//             const data = {
//                 user_fullname: req.body.user_fullname,
//                 user_gender: req.body.user_gender,
//                 user_email: req.body.user_email,
//                 user_password: req.body.user_password,
//                 user_phone: req.body.user_phone,
//                 user_birthday: req.body.user_birthday,
//                 user_address: req.body.user_address,
//             }
//             const update = await ModelUser.findByIdAndUpdate(req.body.id_user, data);
//             return res.status(200).json(update);
//         }
//         catch (e) {
//             console.log(e)
//             return res.status(500).send("Thất bại! Có lỗi xảy ra")
//         }
//     })
// }
