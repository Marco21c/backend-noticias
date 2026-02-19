import mongoose, { Schema } from 'mongoose';
import type { IUser } from '../interfaces/user.interface.js';

const UserSchema: Schema = new Schema(
	{
		email: { type: String, required: true, unique: true, lowercase: true, trim: true },
		password: { type: String, required: true },
		role: {
			type: String,
			enum: ['superadmin', 'admin', 'editor', 'user'],
			default: 'user',
			required: true,
		},
		name: { type: String },
		lastName: { type: String },
	},
	{ timestamps: true }
);

export default (mongoose.models.User as mongoose.Model<IUser>) || mongoose.model<IUser>('User', UserSchema);