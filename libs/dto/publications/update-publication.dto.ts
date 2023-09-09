import { IsBooleanString, IsDefined, IsNotEmpty, IsNumberString, IsOptional, IsString } from 'class-validator';

export class UpdatePublicationDto {
  @IsNumberString()
  @IsString()
  @IsDefined()
  id: number;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  title?: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  content?: string;

  @IsOptional()
  image?: string | null;

  @IsBooleanString()
  @IsOptional()
  isPublished?: string | boolean;
  authorId?: string;
}
