import Product, { IProduct } from '../models/Product';
import GenericController, { HttpMethods } from '../utils/GenericController';

class ProductController extends GenericController<IProduct> {
  model = Product
  public methods: HttpMethods[] = [
    'GET',
    'POST',
    'PUT',
    'DELETE',
  ]
}

export default new ProductController();
