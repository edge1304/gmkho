const prefixApi = '/api/menu';
import sanitize from "mongo-sanitize";
import * as helper from '../../helper/helper.js'
import * as validator from '../../helper/validator.js'
import {ModelMenu} from '../../models/Menu.js'
import {ModelCategory} from '../../models/Category.js'
import {ModelSuperCategory} from '../../models/SuperCategory.js'


export const management = async(app)=>{
    //#region api lấy danh sách chức năng và nhóm người dùng
    app.get(prefixApi, helper.authenToken, async (req, res)=>{
        try
        {
            if(!await helper.checkPermission("61ea38244d09cf202a258fe9", req.body._caller.id_employee_group)) return res.status(403).send("Thất bại! Bạn không có quyền truy cập chức năng này")
            var query = {}
            if(validator.isDefine(req.query.menu_type))
            {
                query = {menu_type:req.query.menu_type}
                
            }
            const data = await ModelMenu.find(query)
            try{
                for(let i = 0 ;i<data.length ;i++)
                {
                    for(let j =0;j<data[i].menu_content.length;j++)
                    {
                        if(data[i].menu_type == "Category")
                        {
                            const dataCate = await ModelCategory.findById(data[i].menu_content[j])
                            data[i].menu_content[j] = {
                                id_category:dataCate._id,
                                category_name:dataCate.category_name,
                                category_image:dataCate.category_image
                            }
                        }
                        else  if(data[i].menu_type == "SuperCategory")
                        {
                            const dataSuperCate = await ModelSuperCategory.findById(data[i].menu_content[j])
                            data[i].menu_content[j] = {
                                id_super_category:dataSuperCate._id,
                                super_category_name:dataSuperCate.super_category_name,
                            }
                        }
                    }
                    
                }
                return res.json(data)
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
    //#endregion api lấy danh sách chức năng và nhóm người dùng

}


