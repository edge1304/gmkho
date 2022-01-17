const prefixApi = '/api/asset';
import sanitize from "mongo-sanitize";
import * as helper from '../../helper/helper.js'
import * as validator from '../../helper/validator.js'
import path from 'path';
import { ModelAsset } from '../../models/Asset.js'

import multer from 'multer'

export const management = async (app) => {
  //#region api lấy danh sách chức năng và nhóm người dùng
  app.get(prefixApi, helper.authenToken, async (req, res) => {
    try {
      if (!await helper.checkPermission("61e1576af8bf2521b16be20a", req.body._caller.id_employee_group))
        return res
          .status(403)
          .send("Thất bại! Bạn không có quyền truy cập chức năng này")
      // console.log(req.query);
      const data = await ModelAsset.find();
      return res.json(data);
    }
    catch (e) {
      console.log(e)
      return res.status(500).send("Thất bại! Có lỗi xảy ra")
    }
  })
  //#endregion api lấy danh sách chức năng và nhóm người dùng

}
