import Order, { IOrder } from '../models/Order';
import GenericController, { HttpMethods } from '../utils/GenericController';

class OrderController extends GenericController<IOrder> {
  model = Order
  public methods: HttpMethods[] = [
    'GET',
    'POST',
  ]
}


export default new OrderController();
