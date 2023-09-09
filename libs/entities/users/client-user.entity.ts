import { Column, Entity } from 'typeorm';
import { ContentUserEntity } from './content/content-user.entity';
import { ClientUserRolesEnum } from '../../enums/client-user-roles.enum';

@Entity({ name: 'client_user' })
export class ClientUserEntity extends ContentUserEntity {
  @Column({ name: 'full_name', nullable: false })
  fullName: string;

  @Column({ type: 'enum', enum: ClientUserRolesEnum, default: ClientUserRolesEnum.AUTHOR })
  role: ClientUserRolesEnum;

  @Column({ name: 'may_publish', default: false })
  mayPublish: boolean;
}
