//6272511fda540000f1000fc2
import sanitize from "mongo-sanitize"
import * as helper from "../../helper/helper.js"
import * as validator from "../../helper/validator.js"
import { ModelCategory } from "../../models/Category.js"
import { Model_Website_Component } from "../../models/WebsiteComponent.js"
const prefixApi = "/api/website-component"
const FIXED_LIMIT = 10
import path from "path"
import multer from "multer"
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/images/images_website_component")
    },
    filename: function (req, file, cb) {
        cb(null, path.basename(file.originalname).replace(path.extname(file.originalname), "-") + Date.now() + path.extname(file.originalname))
    },
})

export const management = async (app) => {
    app.get(prefixApi, helper.authenToken, async (req, res) => {
        try {
            if (!(await helper.checkPermission("6272511fda540000f1000fc2", req.body._caller.id_employee_group))) return res.status(403).send("Thất bại! Bạn không có quyền truy cập chức năng này")
            const data = await Model_Website_Component.find()
            if (validator.isDefine(data)) {
                return res.json({ data: data })
            } else {
                return res.json({ data: null })
            }
        } catch (e) {
            validator.throwError(e)
            return res.status(500).send("Thất bại! Có lỗi xảy ra")
        }
    })
    app.put(prefixApi + "/:component", helper.authenToken, async (req, res) => {
        try {
            if (!(await helper.checkPermission("6272511fda540000f1000fc2", req.body._caller.id_employee_group))) return res.status(403).send("Thất bại! Bạn không có quyền truy cập chức năng này")
            const component = req.params.component
            switch (component) {
                case `title`: {
                    let upload = multer({ storage: storage, fileFilter: null }).array("image_title", 1)
                    upload(req, res, async (err) => {
                        if (err) {
                            console.log(err)
                            return res.status(400).send("Thất bại! Ảnh không phù hợp")
                        }
                        //
                        const _id = req.body._id
                        const _DATA = await Model_Website_Component.findById(_id)
                        if (!validator.isDefine(_DATA)) {
                            return res.status(404).json(`Không tìm thấy nội dung cần được chỉnh sửa`)
                        }
                        //
                        const title = req.body.title.trim()
                        if (title.length == 0) return res.status(400).send("Thất bại! Tiêu đề không được để trống")
                        const img_old_title = _DATA?.Content?.Title?.Content?.Image || null
                        var newValue = _DATA.Content
                        newValue.Title.Content.Title = title
                        let check_delete_img_old = false
                        if (req.files.length > 0) {
                            check_delete_img_old = true
                            newValue.Title.Content.Image = req.files[0].filename
                        }
                        try {
                            const dataUpdate = await Model_Website_Component.findByIdAndUpdate(_DATA._id, {
                                $set: {
                                    Content: newValue,
                                },
                            })
                            if (check_delete_img_old) {
                                await validator.removeFile(validator.URL_IMAGE_WEBSITE_COMPONENT + "/" + img_old_title)
                            }
                            return res.json(dataUpdate)
                        } catch (e) {
                            console.log(e)
                            return res.status(500).send("Thất bại! Có lỗi xảy ra")
                        }
                    })
                }
                case `seo-image`: {
                    let upload = multer({ storage: storage, fileFilter: null }).array("image", 1)
                    upload(req, res, async (err) => {
                        if (err) {
                            console.log(err)
                            return res.status(400).send("Thất bại! Ảnh không phù hợp")
                        }
                        //
                        const _id = req.body._id
                        const _DATA = await Model_Website_Component.findById(_id)
                        if (!validator.isDefine(_DATA)) {
                            return res.status(404).json(`Không tìm thấy nội dung cần được chỉnh sửa`)
                        }
                        //
                        const img_old = _DATA?.Content?.SEO_image?.Content || null
                        var newValue = _DATA.Content
                        let check_delete_img_old = false
                        if (req.files.length > 0) {
                            check_delete_img_old = true
                            newValue.SEO_image.Content = req.files[0].filename
                        }
                        try {
                            const dataUpdate = await Model_Website_Component.findByIdAndUpdate(_DATA._id, {
                                $set: {
                                    Content: newValue,
                                },
                            })
                            if (check_delete_img_old) {
                                await validator.removeFile(validator.URL_IMAGE_WEBSITE_COMPONENT + "/" + img_old)
                            }
                            return res.json(dataUpdate)
                        } catch (e) {
                            console.log(e)
                            return res.status(500).send("Thất bại! Có lỗi xảy ra")
                        }
                    })
                }
                default:
                    break
            }
        } catch (e) {
            validator.throwError(e)
            return res.status(500).send("Thất bại! Có lỗi xảy ra")
        }
    })
}
