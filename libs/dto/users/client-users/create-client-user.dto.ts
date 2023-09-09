import { IsDefined, IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateClientUserDto {
  @IsEmail()
  @IsDefined()
  email: string;

  @Length(8)
  @IsString()
  @IsDefined()
  password: string;

  @IsNotEmpty()
  @IsString()
  @IsDefined()
  fullName: string;
}
