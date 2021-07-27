import { Document } from 'mongoose';

export default interface Products extends Document {
    id:Buffer;
    name: string;
    description: string;
    owner: string;
    cursor: Buffer;
    createdAt:Date;
    updatedAt:Date;
}
