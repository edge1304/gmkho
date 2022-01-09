import mongoose from "mongoose";
import * as validator from "./../helper/validator.js";
const SchemaNotification = new mongoose.Schema(
    {
        notification_topic: {  // kênh gửi thông báo . thường là số điện thoại
            ...validator.schemaString,
            ...validator.schemaRequired,
            ...validator.schemaAutoIndex,
        },
        notification_title: {  // tiêu đề thống báo, ví dụ: Thông báo, Cảnh báo ...
            ...validator.schemaString,
        },
        notification_time: {  // thời gian server gửi đến thông báo
            ...validator.schemaDatetime,
        },
        id_from: { // thông báo lấy từ đơn gì , phiếu gì
            ...validator.schemaObjectId,
            ...validator.schemaAutoIndex,
        },
        notification_type: { ...validator.schemaString }, // thống báo của cái gì
    },
    { timestamps: true }
);

SchemaNotification.index({ createdAt: 1 });
SchemaNotification.index({ updatedAt: 1 });

validator.schePre(SchemaNotification)

export const ModelNotification = mongoose.model("Notification", SchemaNotification);
