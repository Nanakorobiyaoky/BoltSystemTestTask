import { ContentUserEntity } from './content/content-user.entity';
import { Column, Entity } from 'typeorm';
import { SystemUserRoles } from '../../roles/system-user.roles';

@Entity({ name: 'system_user' })
export class SystemUserEntity extends ContentUserEntity {
  @Column({ type: 'varchar', nullable: false, unique: true })
  name: string;

  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive: boolean;

  @Column({ type: 'enum', enum: SystemUserRoles, default: SystemUserRoles.ADMIN })
  role: SystemUserRoles;
}
