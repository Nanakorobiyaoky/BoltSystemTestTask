import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateClientUserDto } from '../../../libs/dto/users/client-users/create-client-user.dto';
import { CreateSystemUserDto } from '../../../libs/dto/users/system-users/create-system-user.dto';
import { SigninDto } from '../../../libs/dto/users/signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'signup' })
  signup(@Payload() data: CreateClientUserDto): Promise<{ token: string }> {
    return this.authService.signup(data);
  }

  @MessagePattern({ cmd: 'signupSystemUser' })
  signupSystemUser(@Payload() data: CreateSystemUserDto): Promise<{ token: string }> {
    return this.authService.signupSystemUser(data);
  }

  @MessagePattern({ cmd: 'signin' })
  signin(@Payload() data: SigninDto): Promise<{ token: string }> {
    return this.authService.signin(data);
  }

  @MessagePattern({ cmd: 'hashPassword' })
  hashPassword(@Payload() password: string): Promise<string> {
    return this.authService.hashPassword(password);
  }
}
