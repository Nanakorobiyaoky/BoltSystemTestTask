import { ContentUserEntity } from './content/content-user.entity';
import { Column, Entity } from 'typeorm';
import { SystemUserRolesEnum } from '../../enums/system-user-roles.enum';

@Entity({ name: 'system_user' })
export class SystemUserEntity extends ContentUserEntity {
  @Column({ type: 'varchar', nullable: false, unique: true })
  name: string;

  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive: boolean;

  @Column({ type: 'enum', enum: SystemUserRolesEnum, default: SystemUserRolesEnum.ADMIN })
  role: SystemUserRolesEnum;
}
