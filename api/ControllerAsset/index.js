const prefixApi = '/api/asset';
import sanitize from "mongo-sanitize";
import * as helper from '../../helper/helper.js'
import * as validator from '../../helper/validator.js'
import path from 'path';
import { ModelAsset } from '../../models/Asset.js'

import multer from 'multer'
import { ModelEmployee } from "../../models/Employee.js";

export const management = async (app) => {
  //#region api lấy danh sách chức năng và nhóm người dùng
  app.get(prefixApi, helper.authenToken, async (req, res) => {
    try {
      if (!await helper.checkPermission("61e1576af8bf2521b16be20a", req.body._caller.id_employee_group))
        return res
          .status(403)
          .send("Thất bại! Bạn không có quyền truy cập chức năng này")

      const query = { id_branch: req.body._caller.id_branch }
      if (validator.isDefine(req.query.key)) {
        query.$or = [
          { asset_name: { $regex: ".*" + sanitize(req.query.key) + ".*", $options: "$i" } },
          { id_asset: { $regex: ".*" + sanitize(req.query.key) + ".*" } }
        ]
      }
      if (validator.isDefine(req.query.id_employee_group) && validator.ObjectId.isValid(req.query.id_employee_group)) {
        query.id_employee_group = req.query.id_employee_group
      }
      // console.log("🚀 ~ file: index.js ~ line 29 ~ app.get ~ query", query)
      var limit = 10;
      var page = 0;

      if (validator.isDefine(req.query.limit)) {
        limit = validator.tryParseInt(req.query.limit)
      }
      if (validator.isDefine(req.query.page)) {
        page = validator.tryParseInt(req.query.page)
        if (page <= 0) page = 1
      }
      var arrGroup = []
      // if (req.query.getGroup === 'true') {
      //   arrGroup = await ModelEmployeeGroup.find()
      // }

      const data = await ModelAsset.find(query).sort({ _id: -1 }).skip((page - 1) * limit).limit(limit)
      for (let i = 0; i < data.length; i++) {
        const group = await ModelEmployee.findById(data[i].id_employee)
        data[i].id_employee = group.employee_fullname
      }

      const count = await ModelAsset.countDocuments(query)

      // console.log(res.json({ count }));
      return res.json(data)
    }
    catch (e) {
      console.log(e)
      return res.status(500).send("Thất bại! Có lỗi xảy ra")
    }
  })
}

export const insert = async (app) => {
  app.post(prefixApi, helper.authenToken, async (req, res) => {
    try {
      if (!await helper.checkPermission("61e1576af8bf2521b16be20a", req.body._caller.id_employee_group))
        return res
          .status(403)
          .send("Thất bại! Bạn không có quyền truy cập chức năng này")
      const data = {
        'asset_name': req.body.asset_name,
        'asset_position': req.body.asset_position,
        'asset_price': validator.tryParseInt(req.body.asset_price),
        'asset_expiry': validator.tryParseInt(req.body.asset_expiry),
        'asset_note': req.body.asset_note,
        'id_employee': req.body.id_employee,
        'asset_time': req.body.asset_time,
        'id_asset': req.body.id_asset,
        'id_branch': req.body._caller.id_branch,
      };
      const create = await ModelAsset.create(data);
      return res.status(200).json(create);
    }
    catch (e) {
      console.log(e)
      return res.status(500).send("Thất bại! Có lỗi xảy ra")
    }
  })
}

export const update = async (app) => {
  app.put(prefixApi, helper.authenToken, async (req, res) => {
    try {
      if (!await helper.checkPermission("61e1576af8bf2521b16be20a", req.body._caller.id_employee_group))
        return res
          .status(403)
          .send("Thất bại! Bạn không có quyền truy cập chức năng này")
      const data = {
        'asset_name': req.body.asset_name,
        'asset_position': req.body.asset_position,
        'asset_price': validator.tryParseInt(req.body.asset_price),
        'asset_expiry': validator.tryParseInt(req.body.asset_expiry),
        'asset_note': req.body.asset_note,
        'id_employee': req.body.id_employee,
        'asset_time': req.body.asset_time,
        'id_asset': req.body.id_asset,
        'id_branch': req.body._caller.id_branch,
      };
      const update = await ModelAsset.findByIdAndUpdate(req.body._id, data);
      return res.status(200).json(update);
    }
    catch (e) {
      console.log(e)
      return res.status(500).send("Thất bại! Có lỗi xảy ra")
    }
  })
}
