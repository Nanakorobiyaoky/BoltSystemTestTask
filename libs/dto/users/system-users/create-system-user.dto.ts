import { IsDefined, IsEmail, IsString, Length } from 'class-validator';

export class CreateSystemUserDto {
  @IsEmail()
  @IsDefined()
  email: string;

  @Length(8)
  @IsString()
  @IsDefined()
  password: string;

  @Length(4)
  @IsString()
  @IsDefined()
  name: string;
}
