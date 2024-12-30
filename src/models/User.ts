import mongoose, {Schema, Document} from "mongoose";

export type UserType = Document & {
    email: string
    password: string
    name: string
    confirmed: boolean
}

export const UserSchema : Schema = new Schema({
    email: {
        type: String,
        require: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
    },
    name: {
        type: String,
        require: true,
        trim: true
    },
    confirmed: {
        type: Boolean,
        default: false
    }
}) 

const User = mongoose.model<UserType>('User', UserSchema)
export default User