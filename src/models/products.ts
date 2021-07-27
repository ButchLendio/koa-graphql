import Mongoose, { Schema } from 'mongoose';
import IProducts from '../interfaces/products';

const ProductSchema: Schema = new Schema(
    {
        id: { type: Buffer, required: true, unique: true },
        name: { type: String, required: true },
        description: { type: String, required: true },
        owner: { type: String, required: true },
        cursor: {
            type: Buffer,
            index: true,
          },
    },
    {
        timestamps: true
    }
);

export default Mongoose.model<IProducts>('Products', ProductSchema);
