import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';
export interface IProduct {
    name: string;
    price:number,

}
const productSchema: Schema = new Schema<IProduct>({
    name: {
        type: String,
        required: true,
    },
    price:{
        type: Number,
        required: true,
        min: 0,
    },
    
});

const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;