import { SetMetadata } from '@nestjs/common';
import { ROLES_FOR_HIMSELF } from '../constants/constants';

export const RequiredRolesForHimselfDecorator = (roles: string[]) => SetMetadata(ROLES_FOR_HIMSELF, roles);
