import { Response } from 'express';
import Product, { IProduct } from '../models/Product';
import GenericController, { HttpMethods } from '../utils/an_mern_pack/GenericController';
import { TheRequest } from '../utils/an_mern_pack/types';

class ProductController extends GenericController<IProduct> {
  public model = Product
  public methods: HttpMethods[] = [
    'GET',
    'POST',
    'PUT',
    'DELETE',
  ]
  public async create(req: TheRequest, res: Response){
    const response = super.create(req, res);
    
    return response
  }

}

export default new ProductController();
