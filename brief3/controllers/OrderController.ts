import { Response } from 'express';
import Order, { IOrder } from '../models/Order';
import GenericController, { HttpMethods } from '../utils/an_mern_pack/GenericController';
import { TheRequest } from '../utils/an_mern_pack/types';


class OrderController extends GenericController<IOrder> {
  public model = Order
  public methods: HttpMethods[] = [
    'GET',
    // 'POST',
  ]

  
  
}


export default new OrderController();
