import { Document } from 'mongoose';

export default interface Products extends Document {
    length(length: any);
    id:Buffer;
    name: string;
    description: string;
    ownerId: Buffer;
    cursor: Buffer;
    createdAt:Date;
    updatedAt:Date;
}
