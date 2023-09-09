import { CreateClientUserDto } from './create-client-user.dto';
import { ClientUserRoles } from '../../../roles/client-user.roles';

export class CreateEditorDto extends CreateClientUserDto {
  role: ClientUserRoles;
  mayPublish?: boolean;
}
