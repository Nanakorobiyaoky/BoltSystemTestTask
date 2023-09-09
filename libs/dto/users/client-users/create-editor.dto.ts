import { CreateClientUserDto } from './create-client-user.dto';
import { ClientUserRolesEnum } from '../../../enums/client-user-roles.enum';

export class CreateEditorDto extends CreateClientUserDto {
  role: ClientUserRolesEnum;
  mayPublish?: boolean;
}
