const prefixApi = '/api/permission/';
import sanitize from "mongo-sanitize";
import * as helper from '../../helper/helper.js'
import * as validator from '../../helper/validator.js'
import {ModelEmployee} from '../../models/Employee.js'
import {ModelEmployeeGroup} from '../../models/EmployeeGroup.js'
import {ModelEmployeeSuperGroup} from '../../models/EmployeeSuperGroup.js'
import {ModelFunction} from '../../models/Function.js'

export const management = async(app)=>{
    app.get(prefixApi , helper.authenToken, async (req, res)=>{
        if(!await helper.checkPermission("61d94d9783ab374668b9bdd2", req.body._caller.id_employee_group)) return res.status(403).send("Thất bại! Bạn không có quyền truy cập chức năng này")
        const dataGroups = await ModelEmployeeGroup.find()
        var functions = []
        var dataSuper = []
        if(req.query.getOther === 'true')
        {
            functions = await ModelFunction.find()
            dataSuper = await ModelEmployeeSuperGroup.find()
        }
        return res.json({dataGroups:dataGroups,functions:functions, dataSuper:dataSuper})

    })
}