import { Body, Controller, Get, HttpCode, HttpStatus, Put, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ChangeClientUserRole } from '../../../../../libs/dto/users/client-users/change-client-user-role';
import { RequiredRolesDecorator } from '../../../../../libs/decorators/required-roles.decorator';
import { RoleGuard } from '../../../../../libs/guards/role.guard';
import { SystemUserRoles } from '../../../../../libs/roles/system-user.roles';
import { AuthService } from '../auth.service';
import { UpdateClientUserDto } from '../../../../../libs/dto/users/client-users/update-client-user.dto';
import { ClientUserRoles } from '../../../../../libs/roles/client-user.roles';
import { RequiredRolesForHimselfDecorator } from '../../../../../libs/decorators/required-role-for-himself.decorator';
import { CurrentUserGuard } from '../../../../../libs/guards/current-user.guard';
import { JwtAuthGuard } from '../../../../../libs/guards/jwt-auth.guard';
import { ChangePasswordDto } from '../../../../../libs/dto/users/change-password.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService, private readonly authService: AuthService) {}

  @RequiredRolesDecorator([SystemUserRoles.ADMIN])
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put('change-role')
  changeUserRole(@Body() data: ChangeClientUserRole): Promise<void> {
    const pattern = { cmd: 'changeUserRole' };
    return this.usersService.emitEvent(pattern, data);
  }

  @RequiredRolesDecorator([ClientUserRoles.EDITOR, SystemUserRoles.ADMIN])
  @RequiredRolesForHimselfDecorator([ClientUserRoles.AUTHOR])
  @UseGuards(JwtAuthGuard, RoleGuard, CurrentUserGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put()
  async updateUser(@Body() data: UpdateClientUserDto, @Req() req: Request): Promise<void> {
    if (req.hasOwnProperty('sameUser')) {
      if (req['sameUser'] === true) data = { id: data.id, password: data.password } as ChangePasswordDto;
    }
    const hashPasswordPattern = { cmd: 'hashPassword' };
    const updateUserPattern = { cmd: 'updateUser' };
    if (data.password) {
      data.password = await this.authService.sendMessage(hashPasswordPattern, data.password);
    }
    await this.usersService.emitEvent(updateUserPattern, data);
  }

  @RequiredRolesDecorator([ClientUserRoles.AUTHOR, ClientUserRoles.EDITOR])
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get()
  getAllClientUsers() {
    const pattern = { cmd: 'getAllClientUsers' };
    return this.usersService.sendMessage(pattern, '');
  }
}
