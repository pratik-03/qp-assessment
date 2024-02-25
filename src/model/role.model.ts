import mongoose, { Schema } from 'mongoose';
const modelName = 'role';

const roleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    desc: { type: String },
    is_active: { type: Boolean, default: true },
    created_by: { type: Schema.Types.ObjectId, ref: "user" },
    updated_by: { type: Schema.Types.ObjectId, ref: "user" }
},
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
        versionKey: false,
    }
);

export default mongoose.model(modelName, roleSchema, modelName);

