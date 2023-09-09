import { ClientUserRoles } from '../../../roles/client-user.roles';
import { IsDefined, IsIn, IsString, IsUUID } from 'class-validator';

export class ChangeClientUserRole {
  @IsUUID()
  @IsDefined()
  id: string;

  @IsIn(Object.values(ClientUserRoles))
  @IsString()
  @IsDefined()
  role: ClientUserRoles;
}
