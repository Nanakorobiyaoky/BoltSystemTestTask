import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto } from '../../../../libs/dto/users/signin.dto';
import { CreateClientUserDto } from '../../../../libs/dto/users/client-users/create-client-user.dto';
import { CreateSystemUserDto } from '../../../../libs/dto/users/system-users/create-system-user.dto';
import { ClientUserRolesEnum } from '../../../../libs/enums/client-user-roles.enum';
import { RequiredRolesDecorator } from '../../../../libs/decorators/required-roles.decorator';
import { SystemUserRolesEnum } from '../../../../libs/enums/system-user-roles.enum';
import { RoleGuard } from '../../../../libs/guards/role.guard';
import { SignupAuthorGuard } from '../../../../libs/guards/signup-author.guard';
import { JwtAuthGuard } from '../../../../libs/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  signin(@Body() data: SigninDto): Promise<{ token: string }> {
    return this.authService.signin(data);
  }

  @RequiredRolesDecorator([ClientUserRolesEnum.EDITOR])
  @UseGuards(SignupAuthorGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('signup')
  signup(@Body() data: CreateClientUserDto): Promise<{ token: string }> {
    return this.authService.signup(data);
  }

  @RequiredRolesDecorator([SystemUserRolesEnum.ADMIN])
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('signup-system-user')
  signupSystemUser(@Body() data: CreateSystemUserDto): Promise<{ token: string }> {
    return this.authService.signupSystemUser(data);
  }

  @RequiredRolesDecorator([SystemUserRolesEnum.ADMIN])
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('signup-editor')
  signupEditor(@Body() body: CreateClientUserDto): Promise<void> {
    return this.authService.signupEditor(body);
  }
}
