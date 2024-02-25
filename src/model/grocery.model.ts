import mongoose, { Schema } from 'mongoose';
const modelName = 'grocery';
const grocerySchema = new mongoose.Schema({
    name: { type: String },
    desc: { type: String },
    price: { type: Number },
    quantity: { type: Number },
    unit: { type: String },
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

export default mongoose.model(modelName, grocerySchema, modelName);