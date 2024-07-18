import Order, { IOrder } from '../models/Order';
import GenericController, { HttpMethods, HttpQueryValidations, Middlewares } from '../utils/an_mern_pack/GenericController';


class OrderController extends GenericController<IOrder> {
  public model = Order
  public methods: HttpMethods[] = [
    'GET',
    // 'POST',
  ]
  
}


export default new OrderController();
