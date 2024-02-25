import mongoose, { Schema } from 'mongoose';
const modelName = 'order';

const OrderItemSchema = new mongoose.Schema({
    grocery: { type: Schema.Types.ObjectId, ref: "grocery" },
    quantity: { type: Number }
});

const OrderSchema = new mongoose.Schema({
    items: [OrderItemSchema],
    amount: { type: Number },
    date: { type: Date, default: new Date() },
    is_active: { type: Boolean, default: true },
    created_by: { type: Schema.Types.ObjectId, ref: "user" },
    updated_by: { type: Schema.Types.ObjectId, ref: "user" }
},
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
        versionKey: false,
    }
);

export default mongoose.model(modelName, OrderSchema, modelName);