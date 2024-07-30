import {
  BadGatewayException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserRequest } from '../../payload/request/createrequest';
import { User } from '../../model/user';
import { UserRepository } from '../../repository/repository.user';
import { UserService } from './user.service';
import { encodePassword } from '../../utils/bcrypt';

@Injectable()
export class DefaultUserService extends UserService {
  private readonly logger = new Logger(DefaultUserService.name);
  constructor(private userRepository: UserRepository) {
    super();
  }

  async registeruser(req: CreateUserRequest): Promise<User> {
    this.logger.log('User tries to signup');
    if (req.password !== req.confirmpassword) {
      throw new BadGatewayException(
        'Password and confirm password should be same',
      );
    }
    const hashedpassword = encodePassword(req.password);
    const reguser = new User();
    reguser.email = req.email;
    this.logger.log(req.email);
    reguser.password = hashedpassword;
    return this.userRepository.save(reguser);
  }

  async getUserByEmail(email: string): Promise<User> {
    this.logger.log('Finds email from User repository');
    return this.userRepository.findUserByEmail(email);
  }

  async updatePassword(email: string, password: string) {
    this.logger.log('Updating password and saves in to User database');
    const hashedPassword = encodePassword(password);
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.password = hashedPassword;
    await this.userRepository.saveUserByResetPassword(user);
    return {
      message: 'Password has been reset successfully',
    };
  }
}
