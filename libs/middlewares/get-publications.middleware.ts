import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ClientUserRolesEnum } from '../enums/client-user-roles.enum';
import { ONLY_PUBLISHED } from '../constants/constants';

@Injectable()
export class GetPublicationsMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const auth = req.headers['authorization'];
    req[ONLY_PUBLISHED] = true;
    if (auth) {
      const [bearer, token] = auth.split(' ');
      const user = this.jwtService.verify(token);
      req['user'] = user;
      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException();
      }
      if (user.role !== ClientUserRolesEnum.AUTHOR) {
        req[ONLY_PUBLISHED] = false;
      }
    }
    next();
  }
}
