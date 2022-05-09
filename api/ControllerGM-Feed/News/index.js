const prefixApi = '/api/gm-feed/news';
import sanitize from "mongo-sanitize";
import * as helper from '../../../helper/helper.js'
import * as validator from '../../../helper/validator.js'

import { ModelNews } from '../../../models/News.js'
import multer from 'multer'
import path from 'path';
export const management = async (app)=>{
    app.get(prefixApi,helper.authenToken, async (req, res)=>{
        try {
          
            if(!await helper.checkPermission("62636bc5cb9c71fcc9f76989", req.body._caller.id_employee_group)) return res.status(403).send("Thất bại! Bạn không có quyền truy cập chức năng này")
            let query = {}
            
            if (validator.isDefine(req.query.fromdate) && validator.isDefine(req.query.todate)) {
                query = {
                    ...query,
                    ...validator.query_createdAt(req.query.fromdate , req.query.todate)
                }
            }
  
            let sort = {_id:-1}
            if (validator.isDefine(req.query.key)) {
                const search_key = validator.viToEn(req.query.key).replace(/[^a-zA-Z0-9]/g, " ")
                query = {
                    ...query,
                    $or:[{$text: {$search: search_key}}],
                }
                sort= {
                    score: { $meta: "textScore" },
                    ...sort,
                } 
            }
            if (validator.isDefine(req.query.key) && validator.ObjectId.isValid(req.query.key)) {
                query = {_id: validator.ObjectId(req.query.key)}
                    
            }
           
            const data = await ModelNews.find(query).sort(sort).skip(validator.getOffset(req)).limit(validator.getLimit(req))
            const count = await ModelNews.countDocuments(query)
            return res.json({data:data, count:count})
        }
        catch (e) {
            console.log(e)
            return res.status(500).send("Thất bại! Có lỗi xảy ra")
        }
    })
}

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, validator.URL_IMAGE_NEWS)
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
}).single('image_news');

export const get_by_id = async (app)=>{
    app.get(prefixApi +"/byId",helper.authenToken, async (req, res)=>{
        try {
            if(!await helper.checkPermission("62636bc5cb9c71fcc9f76989", req.body._caller.id_employee_group)) return res.status(403).send("Thất bại! Bạn không có quyền truy cập chức năng này")
            const id_news = req.query.id_news
            
            if(!validator.isDefine(id_news) || !validator.ObjectId.isValid(id_news)) return res.status(400).send("Thất bại! Không tìm thấy khuyển mại này")
            const data = await ModelNews.findById(id_news)
            return res.json(data)
        }
        catch (e) {
            console.log(e)
            return res.status(500).send("Thất bại! Có lỗi xảy ra")
        }
    })
}


export const insert = async (app)=>{
    app.post(prefixApi,helper.authenToken, async (req, res)=>{
        try {
            if(!await helper.checkPermission("62636bc5cb9c71fcc9f76989", req.body._caller.id_employee_group)) return res.status(403).send("Thất bại! Bạn không có quyền truy cập chức năng này")
            upload_image(req, res, async (err) =>{
                try{
                    if(err) return res.status(400).send(err)  
                    const id_news = req.body.id_news
                    const title_news = req.body.title_news
                    const news_content = req.body.news_content
                    const image_news = req.body.old_image
                    
                    if(!validator.isDefine(title_news) || title_news.length ==0) return res.status(400).send("Tiêu đề không được để trống")
                    var values = {
                        news_title: title_news,
                        news_content:news_content,
                        news_image:image_news
                    }
                   
                    if( req.file)
                    {
                        values = {
                            ...values,
                            news_image : req.file.filename
                        }
                    }
             
                    if(!values.news_image) return res.status(400).send("Thất bại! Ảnh nội bật không được để trống")

                    if(validator.isDefine(id_news) && id_news.length > 0 && validator.ObjectId.isValid(id_news)){
                        await ModelNews.findByIdAndUpdate(id_news,values)

                    }
                    else{
                        await new ModelNews(values).save()

                    }
                    return res.json("Success")
                }
                catch(e){
                    console.log(e)
                    return res.status(500).send("Thất bại! Có lỗi xảy ra")
                }
                
                
            })
        }
        catch (e) {
            console.log(e)
            return res.status(500).send("Thất bại! Có lỗi xảy ra")
        }
    })
}

export const get_data_client = async (app)=>{
    app.get(prefixApi+"/client", async (req, res)=>{
        try {
            let query = {}
            
            if (validator.isDefine(req.query.fromdate) && validator.isDefine(req.query.todate)) {
                query = {
                    ...query,
                    ...validator.query_createdAt(req.query.fromdate , req.query.todate)
                }
            }
  
            let sort = {_id:-1}
            if (validator.isDefine(req.query.key)) {
                const search_key = validator.viToEn(req.query.key).replace(/[^a-zA-Z0-9]/g, " ")
                query = {
                    ...query,
                    $or:[{$text: {$search: search_key}}],
                }
                sort= {
                    score: { $meta: "textScore" },
                    ...sort,
                } 
            }
            if (validator.isDefine(req.query.key) && validator.ObjectId.isValid(req.query.key)) {
                query = {_id: validator.ObjectId(req.query.key)}
                sort = {_id:-1}
            }

            if(validator.isDefine(req.query._id) && validator.ObjectId.isValid(req.query._id)){
                query = {_id: validator.ObjectId(req.query._id)}
                sort = {_id:-1}
            }
            const data = await ModelNews.find(query).sort(sort).skip(validator.getOffset(req)).limit(validator.getLimit(req))
       
            return res.json({data:data})
        }
        catch (e) {
            console.log(e)
            return res.status(500).send("Thất bại! Có lỗi xảy ra")
        }
    })
}