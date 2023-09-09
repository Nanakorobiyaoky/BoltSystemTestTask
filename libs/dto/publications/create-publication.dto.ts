import { IsDefined, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePublicationDto {
  @IsNotEmpty()
  @IsString()
  @IsDefined()
  title: string;

  @IsNotEmpty()
  @IsString()
  @IsDefined()
  content: string;

  @IsOptional()
  image?: string;
  authorId?: string;
}
