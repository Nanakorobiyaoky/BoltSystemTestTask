import { Controller } from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PublicationEntity } from '../../../libs/entities/publications/publication.entity';
import { CreatePublicationDto } from '../../../libs/dto/publications/create-publication.dto';
import { UpdatePublicationDto } from '../../../libs/dto/publications/update-publication.dto';
import { DeletePublicationByAuthorDto } from '../../../libs/dto/publications/delete-publication-by-author.dto';
import { GetPublicationsDto } from '../../../libs/dto/publications/get-publications.dto';

@Controller()
export class PublicationsController {
  constructor(private readonly publicationsService: PublicationsService) {}

  @MessagePattern({ cmd: 'getAllPublications', onlyPublished: true })
  getAllPublishedPublications(@Payload() authorId: string): Promise<PublicationEntity[]> {
    return this.publicationsService.getAllPublications(authorId, true);
  }

  @MessagePattern({ cmd: 'getAllPublications', onlyPublished: false })
  getAllPublications(@Payload() authorId: string): Promise<PublicationEntity[]> {
    return this.publicationsService.getAllPublications(authorId, false);
  }

  @MessagePattern({ cmd: 'createPublication' })
  createPublication(@Payload() data: CreatePublicationDto): Promise<PublicationEntity> {
    return this.publicationsService.createPublication(data);
  }

  @MessagePattern({ cmd: 'getPublicationById', onlyPublished: true })
  getPublishedPublicationById(@Payload() data: GetPublicationsDto): Promise<PublicationEntity> {
    return this.publicationsService.getPublicationById(data, true);
  }

  @MessagePattern({ cmd: 'getPublicationById', onlyPublished: false })
  getPublicationById(@Payload() data: GetPublicationsDto): Promise<PublicationEntity> {
    return this.publicationsService.getPublicationById(data, false);
  }

  @MessagePattern({ cmd: 'updatePublicationByEditor' })
  updatePublicationByEditor(@Payload() data: UpdatePublicationDto): Promise<PublicationEntity> {
    return this.publicationsService.updatePublicationByEditor(data);
  }

  @MessagePattern({ cmd: 'updatePublicationByAuthor' })
  updatePublicationsByAuthor(@Payload() data: { user: any; post: UpdatePublicationDto }): Promise<PublicationEntity> {
    return this.publicationsService.updatePublicationByAuthor(data);
  }

  @MessagePattern({ cmd: 'deletePublication' })
  deletePublication(@Payload() id: number) {
    return this.publicationsService.deletePublicationById(id);
  }

  @MessagePattern({ cmd: 'deletePublicationByAuthor' })
  deletePublicationByAuthor(@Payload() data: DeletePublicationByAuthorDto) {
    return this.publicationsService.deletePublicationByAuthor(data);
  }
}
