const prefixApi = '/api/category';
import sanitize from "mongo-sanitize";
import * as helper from '../../helper/helper.js'
import * as validator from '../../helper/validator.js'
import path from 'path';
import {ModelSuperCategory} from '../../models/SuperCategory.js'
import {ModelCategory} from '../../models/Category.js'

import multer from 'multer'



export const management = async(app)=>{
    //#region api lấy danh sách chức năng và nhóm người dùng
    app.get(prefixApi, helper.authenToken, async (req, res)=>{
        try
        {
            if(!await helper.checkPermission("61e15772f8bf2521b16be20c", req.body._caller.id_employee_group)) return res.status(403).send("Thất bại! Bạn không có quyền truy cập chức năng này")
            try {
                var arrSuperCategory = []
                if(req.query.getOther == 'true')
                {
                    arrSuperCategory = await ModelSuperCategory.find()
                }
                var query = {}
                if( validator.isDefine(req.query.category_name)) query = {...query, category_name:{$regex:".*"+sanitize(req.query.category_name)+".*"}}
                if( validator.isDefine(req.query.id_super_category) && validator.ObjectId.isValid(req.query.id_super_category)) query = {...query,id_super_category:req.query.id_super_category }
                
                const data = await ModelCategory.find(query).skip(validator.getOffset(req)).limit(validator.getLimit(req))
                const count = await ModelCategory.countDocuments(query)

                return res.json({data:data, count:count, arrSuperCategory:arrSuperCategory})
            } catch (err) {
                console.log(err)
            }
        }
        catch(e)
        {
            console.log(e)
            return res.status(500).send("Thất bại! Có lỗi xảy ra")
        } 
    })
}

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, validator.URL_IMAGE_CATEGORY)
    },
    filename: function(req, file, cb) {
        cb(null,path.basename(file.originalname).replace(path.extname(file.originalname),'-') + Date.now() + path.extname(file.originalname))
    }
});
const upload_image = multer({
    storage: storage,
    fileFilter: function(req, file, cb) {
        if (file.mimetype == "image/bmp" || file.mimetype == "image/png" || file.mimetype == "image/jpeg" || file.mimetype == "image/jpg" || file.mimetype == "image/jfif") {
            cb(null, true)
        } else {
            return cb(new Error('Only image are allowed!'))
        }
    }
}).single('category_image')

export const update = async (app)=>{
    
    app.put(prefixApi, helper.authenToken, async (req, res)=>{
        try
        {
            if(!await helper.checkPermission("61e15772f8bf2521b16be20c", req.body._caller.id_employee_group)) return res.status(403).send("Thất bại! Bạn không có quyền truy cập chức năng này")
            upload_image(req, res, async (err) =>{
                try
                {
                    const id_category = req.body.id_category

                    const dataCategory = await ModelCategory.findById(id_category)
                    if(!dataCategory) return res.status(400).send("Thất bại! Không tìm thấy danh mục cần update")

                    const imgOld = dataCategory.category_image 

                    const category_image = typeof req.file != 'undefined' ? req.file.filename:imgOld
                    const category_name = req.body.category_name.trim()
                    const category_status = req.body.category_status
                    const id_super_category = req.body.id_super_category

                    if(category_name.length == 0) return res.status(400).send("Thất bại! Tên danh mục không được để trống")
                    try
                    {
                        const updateNew = await ModelCategory.findByIdAndUpdate(id_category,{
                            category_image :category_image ,
                            category_name :category_name ,
                            category_status :category_status,
                            id_super_category:id_super_category
                        })

                        if(typeof req.file != 'undefined')  // xóa ảnh cũ
                        {
                            await validator.removeFile(validator.URL_IMAGE_CATEGORY+"/"+imgOld)
                        }
                        return res.json(updateNew)
                    }
                    catch(e)
                    {
                        console.log(e)
                        return res.status(500).send("Thất bại! Có lỗi xảy ra")
                    }
                    
                }
                catch(e)
                {
                    console.log(e)
                    return res.status(500).send("Thất bại! Có lỗi xảy ra")
                } 
            })
        }
        catch(e)
        {
            console.log(e)
            return res.status(500).send("Thất bại! Có lỗi xảy ra")
        }
    })
}


export const insert = async (app)=>{
    
    app.post(prefixApi, helper.authenToken, async (req, res)=>{
        try
        {
            if(!await helper.checkPermission("61e15772f8bf2521b16be20c", req.body._caller.id_employee_group)) return res.status(403).send("Thất bại! Bạn không có quyền truy cập chức năng này")
            upload_image(req, res, async (err) =>{
                try
                {
                    const category_image = typeof req.file != 'undefined' ? req.file.filename:null
                    const category_name = req.body.category_name.trim()
                    const category_status = req.body.category_status
                    const id_super_category = req.body.id_super_category

                    if(category_name.length == 0) return res.status(400).send("Thất bại! Tên danh mục không được để trống")
                    try
                    {
                        const insertNew = await ModelCategory({
                            category_image :category_image ,
                            category_name :category_name ,
                            category_status :category_status,
                            id_super_category:id_super_category
                        }).save()

                        return res.json(insertNew)
                    }
                    catch(e)
                    {
                        console.log(e)
                        return res.status(500).send("Thất bại! Có lỗi xảy ra")
                    }
                    
                }
                catch(e)
                {
                    console.log(e)
                    return res.status(500).send("Thất bại! Có lỗi xảy ra")
                } 
            })
        }
        catch(e)
        {
            console.log(e)
            return res.status(500).send("Thất bại! Có lỗi xảy ra")
        }
    })
}


