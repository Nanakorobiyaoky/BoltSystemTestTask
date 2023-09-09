import { IsDefined, IsEmail, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateClientUserDto {
  @IsUUID()
  @IsDefined()
  id: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  fullName?: string;
}
