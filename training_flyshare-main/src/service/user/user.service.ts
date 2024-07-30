import { CreateUserRequest } from '../../payload/request/createrequest';
import { User } from '../../model/user';

export abstract class UserService {
  abstract registeruser(req: CreateUserRequest): Promise<User>;
  abstract getUserByEmail(email: string): Promise<User>;
  abstract updatePassword(email: string, password: string);
}
