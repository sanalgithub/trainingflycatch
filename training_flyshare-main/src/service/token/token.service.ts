import { Token } from '../../model/token';
import { UserForgotPasswordRequest } from '../../payload/request/user-forgot-password-request';

export abstract class TokenService {
  abstract createToken(req: UserForgotPasswordRequest): Promise<Token>;
  abstract findToken(code: string): Promise<Token>;
  abstract isTokenValid(code: string);
}
