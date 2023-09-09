import { Column, Entity } from 'typeorm';
import { ContentUserEntity } from './content/content-user.entity';
import { ClientUserRoles } from '../../roles/client-user.roles';

@Entity({ name: 'client_user' })
export class ClientUserEntity extends ContentUserEntity {
  @Column({ name: 'full_name', nullable: false })
  fullName: string;

  @Column({ type: 'enum', enum: ClientUserRoles, default: ClientUserRoles.AUTHOR })
  role: ClientUserRoles;

  @Column({ name: 'may_publish', default: false })
  mayPublish: boolean;
}
