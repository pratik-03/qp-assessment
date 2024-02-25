import mongoose, { Schema } from 'mongoose';
const modelName = 'user';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: [{ type: Schema.Types.ObjectId, ref: "role" }],
    is_active: { type: Boolean, default: true },
},
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
        versionKey: false,
    }
);

export default mongoose.model(modelName, userSchema, modelName);


