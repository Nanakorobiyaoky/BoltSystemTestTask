import { SetMetadata } from '@nestjs/common';
import { ROLES } from '../constants/constants';

export const RequiredRolesDecorator = (roles: string[]) => SetMetadata(ROLES, roles);
