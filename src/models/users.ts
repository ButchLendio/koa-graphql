import Mongoose, { Schema } from 'mongoose';
import IUsers from '../interfaces/users';

const UserSchema: Schema = new Schema(
    {
        name:{ type: String, require: true },
        username: { type: String, require: true ,unique:true },
        password: { type: String, require: true }
    },
    {
        timestamps: true
    }
);

export default Mongoose.model<IUsers>('Users', UserSchema);
