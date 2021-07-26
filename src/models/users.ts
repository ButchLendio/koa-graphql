import Mongoose, { Schema } from 'mongoose';
import IUsers from '../interfaces/users';

const UserSchema: Schema = new Schema(
    {
        emailAddress:{ type: String, require: true },
        firstname:{ type: String, require: true },
        lastname: { type: String, require: true },
        password: { type: String, require: true }
    },
    {
        timestamps: true
    }
);

export default Mongoose.model<IUsers>('Users', UserSchema);
