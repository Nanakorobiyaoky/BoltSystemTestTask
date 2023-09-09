import { IsDefined, IsString, IsUUID, Length } from 'class-validator';

export class ChangePasswordDto {
  @IsUUID()
  @IsDefined()
  id: string;

  @Length(8)
  @IsString()
  @IsDefined()
  password: string;
}
