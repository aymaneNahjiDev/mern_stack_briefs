import mongoose, { Document, Schema } from 'mongoose';
import validator from 'validator';
export interface IUser {
    name: string;
    email: string;
    password: string;
}
const userSchema: Schema = new Schema<IUser>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v: string) {
                return validator.isEmail(v);
            },
            message: 'Email is not valid'
        }
    },
    password: {
        type: String,
        required: true,
        validate: [
            {
                validator: (value: string) => value.length >= 8,
                message: 'Password must be at least 8 characters long'
            },
            {
                validator: (value: string) => /[A-Za-z]/.test(value),
                message: 'Password must contain at least one letter'
            },
            {
                validator: (value: string) => /\d/.test(value),
                message: 'Password must contain at least one number'
            },
            {
                validator: (value: string) => /[@$!%*#?&]/.test(value),
                message: 'Password must contain at least one special character'
            }
        ]
    }
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;