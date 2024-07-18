import { Response } from 'express';
import Product, { IProduct } from '../models/Product';
import GenericController, { HttpMethods } from '../utils/an_mern_pack/GenericController';

class ProductController extends GenericController<IProduct> {
  public model = Product
  public methods: HttpMethods[] = [
    'GET',
    'POST',
    'PUT',
    'DELETE',
  ]


}

export default new ProductController();
