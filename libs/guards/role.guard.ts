import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { SystemUserRolesEnum } from '../enums/system-user-roles.enum';
import { ROLES, ROLES_FOR_HIMSELF } from '../constants/constants';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const req = context.switchToHttp().getRequest();
      const roles = this.reflector.getAllAndOverride<string[]>(ROLES, [context.getHandler(), context.getClass()]) ?? [];
      const rolesForHimself =
        this.reflector.getAllAndOverride<string[]>(ROLES_FOR_HIMSELF, [context.getHandler(), context.getClass()]) ?? [];
      const userRole = req.user.role;
      if (roles.includes(userRole) || userRole === SystemUserRolesEnum.ADMIN) return true;
      if (rolesForHimself.includes(userRole)) {
        req.sameUser = true;
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
}
