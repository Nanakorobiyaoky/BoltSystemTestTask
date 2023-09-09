export class UpdatePublicationDto {
  id: number;
  title?: string;
  content?: string;
  image?: string;
  isPublished?: boolean;
  authorId?: string;
}
