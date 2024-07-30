import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  createParamDecorator,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../model/user';
import { AppConfig } from '../config/app.config';

@Injectable()
export class AuthGuard implements CanActivate {
  static readonly CurrentUser = createParamDecorator<string, any, User>(
    (data: string, ctx: ExecutionContext) => {
      const user = ctx.switchToHttp().getRequest().user;

      if (!user) {
        return null;
      }

      return data ? user[data] : user;
    },
  );

  constructor(private appConfig: AppConfig, private jwtService: JwtService) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const http = context.switchToHttp();
    const req = http.getRequest();
    const authHeader = req.headers.authorization;
    if (authHeader == undefined) {
      return false;
    }
    const token = authHeader.split(' ').pop();
    try {
      const decoded = this.jwtService.verify(token, {
        secret: this.appConfig.jwt.token,
      });
      req.user = decoded;
      return true;
    } catch (err) {
      throw new ForbiddenException('Token not valid');
    }
  }
}
