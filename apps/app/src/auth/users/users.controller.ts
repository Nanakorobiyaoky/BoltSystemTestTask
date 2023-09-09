import { Body, Controller, Get, HttpCode, HttpStatus, Put, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ChangeClientUserRole } from '../../../../../libs/dto/users/client-users/change-client-user-role';
import { RequiredRolesDecorator } from '../../../../../libs/decorators/required-roles.decorator';
import { RoleGuard } from '../../../../../libs/guards/role.guard';
import { SystemUserRolesEnum } from '../../../../../libs/enums/system-user-roles.enum';
import { UpdateClientUserDto } from '../../../../../libs/dto/users/client-users/update-client-user.dto';
import { ClientUserRolesEnum } from '../../../../../libs/enums/client-user-roles.enum';
import { RequiredRolesForHimselfDecorator } from '../../../../../libs/decorators/required-role-for-himself.decorator';
import { CurrentUserGuard } from '../../../../../libs/guards/current-user.guard';
import { JwtAuthGuard } from '../../../../../libs/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @RequiredRolesDecorator([SystemUserRolesEnum.ADMIN])
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put('change-role')
  changeUserRole(@Body() data: ChangeClientUserRole): Promise<void> {
    return this.usersService.changeUserRole(data);
  }

  @RequiredRolesDecorator([ClientUserRolesEnum.EDITOR, SystemUserRolesEnum.ADMIN])
  @RequiredRolesForHimselfDecorator([ClientUserRolesEnum.AUTHOR])
  @UseGuards(JwtAuthGuard, RoleGuard, CurrentUserGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put()
  updateUser(@Body() data: UpdateClientUserDto, @Req() req: Request): Promise<void> {
    return this.usersService.updateUser(data, req);
  }

  @RequiredRolesDecorator([ClientUserRolesEnum.AUTHOR, ClientUserRolesEnum.EDITOR])
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get()
  getAllClientUsers() {
    return this.usersService.getAllClientUsers();
  }
}
