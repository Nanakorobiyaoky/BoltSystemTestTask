import { IsDefined, IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, Length } from "class-validator";

export class UpdateClientUserDto {
  @IsUUID()
  @IsDefined()
  id: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @Length(8)
  @IsString()
  @IsOptional()
  password?: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  fullName?: string;
}
