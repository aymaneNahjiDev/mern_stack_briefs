import User, { IUser } from '../models/User';
import GenericController, { HttpMethods } from '../utils/an_mern_pack/GenericController';

class UserController extends GenericController<IUser> {
  model = User
  public methods: HttpMethods[] = [
    'GET',
    'POST',
    'PUT',
  ]
}

export default new UserController();
