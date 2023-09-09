import { ClientUserRolesEnum } from '../../../enums/client-user-roles.enum';
import { IsDefined, IsIn, IsString, IsUUID } from 'class-validator';

export class ChangeClientUserRole {
  @IsUUID()
  @IsDefined()
  id: string;

  @IsIn(Object.values(ClientUserRolesEnum))
  @IsString()
  @IsDefined()
  role: ClientUserRolesEnum;
}
