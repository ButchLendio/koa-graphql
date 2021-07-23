import { Document } from 'mongoose';

export default interface Products extends Document {
    id:string;
    name: string;
    price: string;
    createdBy: string;
    cursor: string;
    createdAt:Date;
    updatedAt:Date;
}
