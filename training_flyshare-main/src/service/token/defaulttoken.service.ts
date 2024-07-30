import { Injectable, Logger } from '@nestjs/common';
import { UserForgotPasswordRequest } from '../../payload/request/user-forgot-password-request';
import { TokenRepository } from '../../repository/repository.token';
import { Token } from '../../model/token';
import { TokenService } from './token.service';
import { UserService } from '../user/user.service';

@Injectable()
export class DefaultTokenService extends TokenService {
  private readonly logger = new Logger(TokenService.name);

  constructor(
    private tokenRepository: TokenRepository,
    private userService: UserService,
  ) {
    super();
  }

  async createToken(req: UserForgotPasswordRequest) {
    this.logger.log('Save tokendetails into Token Database');
    const useremail = await this.userService.getUserByEmail(req.email);
    const tokencode = Math.floor(1000 + Math.random() * 9000).toString();
    const expiryTime = new Date(new Date().getTime() + 300 * 1000);

    const token = new Token();
    token.code = tokencode;
    token.expiretime = expiryTime;
    token.uservalue = useremail;

    return this.tokenRepository.save(token);
  }

  async findToken(code: string) {
    this.logger.log('Finds token from Token repository');
    return this.tokenRepository.findTokenByCode(code);
  }

  async isTokenValid(code: string) {
    this.logger.log('Checks wether token is valid or not');
    const userToken = await this.tokenRepository.findTokenByCode(code);
    const currentTime = new Date().getTime();
    return userToken.expiretime.getTime() <= currentTime;
  }
}
