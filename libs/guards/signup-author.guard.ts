import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RoleGuard } from './role.guard';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ClientUserEntity } from "../entities/users/client-user.entity";
import { ClientUserRolesEnum } from "../enums/client-user-roles.enum";

@Injectable()
export class SignupAuthorGuard extends RoleGuard implements CanActivate {
  constructor(reflector: Reflector, private readonly jwtService: JwtService) {
    super(reflector);
  }
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return true;
    }

    const bearer = authHeader.split(' ')[0];
    const token = authHeader.split(' ')[1];
    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException();
    }
    req.user = this.jwtService.verify(token);
    if (req.user.role === ClientUserRolesEnum.AUTHOR) {
      return false
    }
    return super.canActivate(context);
  }
}
