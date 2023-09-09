import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto } from '../../../../libs/dto/users/signin.dto';
import { CreateClientUserDto } from '../../../../libs/dto/users/client-users/create-client-user.dto';
import { CreateSystemUserDto } from '../../../../libs/dto/users/system-users/create-system-user.dto';
import { ClientUserRoles } from '../../../../libs/roles/client-user.roles';
import { RequiredRolesDecorator } from '../../../../libs/decorators/required-roles.decorator';
import { SystemUserRoles } from '../../../../libs/roles/system-user.roles';
import { RoleGuard } from '../../../../libs/guards/role.guard';
import { SignupAuthorGuard } from '../../../../libs/guards/signup-author.guard';
import { JwtAuthGuard } from '../../../../libs/guards/jwt-auth.guard';
import { CreateEditorDto } from '../../../../libs/dto/users/client-users/create-editor.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  signin(@Body() data: SigninDto): Promise<{ token: string }> {
    const pattern = { cmd: 'signin' };
    return this.authService.sendMessage(pattern, data);
  }

  @RequiredRolesDecorator([ClientUserRoles.EDITOR])
  @UseGuards(SignupAuthorGuard)
  @Post('signup')
  signup(@Body() data: CreateClientUserDto): Promise<{ token: string }> {
    const pattern = { cmd: 'signup' };
    return this.authService.sendMessage(pattern, data);
  }

  @RequiredRolesDecorator([SystemUserRoles.ADMIN])
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('signup-system-user')
  signupSystemUser(@Body() data: CreateSystemUserDto): Promise<{ token: string }> {
    const pattern = { cmd: 'signupSystemUser' };
    return this.authService.sendMessage(pattern, data);
  }

  @RequiredRolesDecorator([SystemUserRoles.ADMIN])
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('signup-editor')
  signupEditor(@Body() createClientUserDto: CreateClientUserDto): Promise<void> {
    const data: CreateEditorDto = { ...createClientUserDto, role: ClientUserRoles.EDITOR, mayPublish: true };
    const pattern = { cmd: 'signup' };
    return this.authService.sendMessage(pattern, data);
  }
}
