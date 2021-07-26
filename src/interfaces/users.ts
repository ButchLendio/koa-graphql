import { Document } from 'mongoose';

export default interface User extends Document{
    id:string;
    name: string
    username: string;
    password: string;
}
