const prefixApi = '/api/fundbook';
import sanitize from "mongo-sanitize";
import * as helper from '../../helper/helper.js'
import * as validator from '../../helper/validator.js'
import { ModelFundBook } from "../../models/FundBook.js";


export const management = async (app) => {
    //#region api lấy danh sách chức năng và nhóm người dùng
    app.get(prefixApi, helper.authenToken, async (req, res) => {
        try
        {
            if(!await helper.checkPermission("61ee736efc3b22e001d48eac", req.body._caller.id_employee_group)) return res.status(403).send("Thất bại! Bạn không có quyền truy cập chức năng này")
            const data = await ModelFundBook.find({id_branch:req.body._caller.id_branch_login})
            return res.json(data)
        }
        catch(e)
        {
            console.log(e)
            return res.status(500).send("Thất bại! Có lỗi xảy ra")
        }
        
    })
}

export const insert = async (app) => {
    //#region api lấy danh sách chức năng và nhóm người dùng
    app.post(prefixApi, helper.authenToken, async (req, res) => {
        try
        {
            if(!await helper.checkPermission("61ee736efc3b22e001d48eac", req.body._caller.id_employee_group)) return res.status(403).send("Thất bại! Bạn không có quyền truy cập chức năng này")
            const fundbook_name = req.body.fundbook_name
            const fundbook_type = req.body.fundbook_type
    
            if(fundbook_type != 'cash' && fundbook_type != 'bank' && fundbook_type != 'other') return res.status(400).send("Thất bại! Không tồn tại loại sổ quỹ này")
            
            try
            {
                const dataNew = await new ModelFundBook({
                    fundbook_name:fundbook_name,
                    fundbook_type:fundbook_type,
                    id_branch:req.body._caller.id_branch_login
                }).save()
                return res.json(dataNew)
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


export const update = async (app) => {
    //#region api lấy danh sách chức năng và nhóm người dùng
    app.put(prefixApi, helper.authenToken, async (req, res) => {
        try
        {
            if(!await helper.checkPermission("61ee736efc3b22e001d48eac", req.body._caller.id_employee_group)) return res.status(403).send("Thất bại! Bạn không có quyền truy cập chức năng này")
            const fundbook_name = req.body.fundbook_name
            const fundbook_type = req.body.fundbook_type
            const id_fundbook = req.body.id_fundbook

            if(fundbook_type != 'cash' && fundbook_type != 'bank' && fundbook_type != 'other') return res.status(400).send("Thất bại! Không tồn tại loại sổ quỹ này")
            
            try
            {
                const dataFund = await ModelFundBook.findById(id_fundbook)
                if(!dataFund) return res.status(400).send("Thất bại! Không tìm thấy sổ quỹ")

                const updateNew = await ModelFundBook.findByIdAndUpdate(dataFund._id,{
                    fundbook_name:fundbook_name,
                    fundbook_type:fundbook_type,
                })
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

export const getFundbookByBranch = async (id_branch)=>{
    const data = await ModelFundBook.find({id_branch:id_branch})
    return data
}