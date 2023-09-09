import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { SystemUserRoles } from '../roles/system-user.roles';
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
      if (roles.includes(userRole) || userRole === SystemUserRoles.ADMIN) return true;
      if (rolesForHimself.includes(userRole)) {
        req.sameUser = true;
        return true;
      }
    } catch {
      return false;
    }
  }
}
