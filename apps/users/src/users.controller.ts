import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { CreateClientUserDto } from '../../../libs/dto/users/client-users/create-client-user.dto';
import { ChangeClientUserRole } from '../../../libs/dto/users/client-users/change-client-user-role';
import { ClientUserEntity } from '../../../libs/entities/users/client-user.entity';
import { SystemUserEntity } from '../../../libs/entities/users/system-user.entity';
import { CreateSystemUserDto } from '../../../libs/dto/users/system-users/create-system-user.dto';
import { UpdateClientUserDto } from '../../../libs/dto/users/client-users/update-client-user.dto';
import { AllUsersDto } from '../../../libs/dto/users/all-users.dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern({ cmd: 'getUserByEmail' })
  getUserByEmail(@Payload() email: string): Promise<ClientUserEntity | SystemUserEntity> {
    return this.usersService.getUserByEmail(email);
  }

  @MessagePattern({ cmd: 'saveUser' })
  saveUser(@Payload() data: CreateClientUserDto): Promise<ClientUserEntity> {
    return this.usersService.saveUser(data);
  }

  @MessagePattern({ cmd: 'saveSystemUser' })
  saveSystemUser(@Payload() data: CreateSystemUserDto): Promise<SystemUserEntity> {
    return this.usersService.saveSystemUser(data);
  }

  @MessagePattern({ cmd: 'getAllClientUsers' })
  getAllClientUsers(): Promise<AllUsersDto> {
    return this.usersService.getAllClientUsers();
  }

  @EventPattern({ cmd: 'changeUserRole' })
  changeUserRole(@Payload() data: ChangeClientUserRole): void {
    this.usersService.changeUserRole(data);
  }

  @EventPattern({ cmd: 'updateUser' })
  updateUser(@Payload() data: UpdateClientUserDto): void {
    this.usersService.updateUser(data);
  }
}
