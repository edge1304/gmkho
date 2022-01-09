import mongoose from "mongoose"
import * as validator from "./../helper/validator.js"
const SchemaCart = new mongoose.Schema({
	id_user:
    {
        ...validator.schemaObjectId,
        ...validator.schemaRequired
    },
    cart_note_user: {...validator.schemaString},
    cart_status: { // trạng thái giỏ hàng , mặc định là giỏ hàng
        ...validator.schemaString,
    },
    cart_datebuy: {...validator.schemaDatetime}, // ngày mua
    cart_date: {...validator.schemaDatetime}, // ngày mua
    cart_note_employee: {...validator.schemaString}, // ghi chú của nhân viên bán hàng
    cart_product: { // danh sách sản phẩm của đơn hàng
        ...validator.schemaArray
    },
    code_discount:{...validator.schemaString},
    money_codediscount:{...validator.schemaMoneyVi},
    id_branch:{  // mã chi nhánh
        ...validator.schemaObjectId,
    },
    id_employee:{  // mã nhân viên , người tạo đơn á
        ...validator.schemaObjectId,
    },
    cart_status_paid: {...validator.schemaBooleanFalse}, // trạng thái đơn đã thanh toán chưa , true rồi , false chưa , default false
    cart_money_paid:{...validator.schemaMoneyVi}, // số tiền đã thanh toán
    id_export_form:{...validator.schemaObjectId} // id phiếu xuất , sau khi thanh toán sẽ có mã phiếu này
},{timestamps: true });

SchemaCart.index({"createdAt": 1})
SchemaCart.index({"updatedAt": 1})

validator.schePre(SchemaCart)
export const  ModelCart = mongoose.model("Cart",SchemaCart);