import { Document } from 'mongoose';

export default interface User extends Document{
    id:Buffer;
    name: string
    username: string;
    password: string;
}
