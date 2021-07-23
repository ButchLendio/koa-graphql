import Mongoose, { Schema } from 'mongoose';
import IProducts from '../interfaces/products';

const ProductSchema: Schema = new Schema(
    {
        id: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        price: { type: String, required: true },
        createdBy: { type: String, required: true },
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
