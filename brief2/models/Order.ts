import mongoose, { Document, Schema } from 'mongoose';
import { IProduct } from './Product';
import { randomUUID } from 'crypto';
import { IUser } from './User';
export interface IOrder {
    ref: string;
    product:IProduct;
    productName:string;
    productPrice:number;
    isApproved:boolean;
    user:IUser;
}
const orderSchema: Schema = new Schema<IOrder>({
    ref: {
        type: String,
        default: randomUUID(),
    },
    product:{
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    productName: {
        type: String,
        required: true,
    },
    productPrice:{
        type: Number,
        required: true,
        min: 0,
    },
    isApproved:{
        type: Boolean,
        default: false,
    },
    user:{
        type: Schema.Types.ObjectId,
        ref:'User',
        required: true,
    },
});
const Order = mongoose.model<IOrder>('Order', orderSchema);

export default Order;