import { Controller } from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PublicationEntity } from '../../../libs/entities/publications/publication.entity';
import { CreatePublicationDto } from '../../../libs/dto/publications/create-publication.dto';
import { UpdatePublicationDto } from '../../../libs/dto/publications/update-publication.dto';
import { DeletePublicationByAuthorDto } from '../../../libs/dto/publications/delete-publication-by-author.dto';

@Controller()
export class PublicationsController {
  constructor(private readonly publicationsService: PublicationsService) {}

  @MessagePattern({ cmd: 'getAllPublications', onlyPublished: true })
  getAllPublishedPublications(): Promise<PublicationEntity[]> {
    return this.publicationsService.getAllPublications(true);
  }

  @MessagePattern({ cmd: 'getAllPublications', onlyPublished: false })
  getAllPublications(): Promise<PublicationEntity[]> {
    return this.publicationsService.getAllPublications(false);
  }

  @MessagePattern({ cmd: 'createPublication' })
  createPublication(@Payload() data: CreatePublicationDto): Promise<PublicationEntity> {
    return this.publicationsService.createPublication(data);
  }

  @MessagePattern({ cmd: 'getPublicationById', onlyPublished: true })
  getPublishedPublicationById(@Payload() id: number): Promise<PublicationEntity> {
    return this.publicationsService.getPublicationById(id, true);
  }

  @MessagePattern({ cmd: 'getPublicationById', onlyPublished: false })
  getPublicationById(@Payload() id: number): Promise<PublicationEntity> {
    return this.publicationsService.getPublicationById(id, false);
  }

  @MessagePattern({ cmd: 'updatePublication' })
  updatePublication(@Payload() data: UpdatePublicationDto): Promise<void> {
    return this.publicationsService.updatePublication(data);
  }

  @MessagePattern({ cmd: 'updatePublicationByAuthor' })
  updatePublicationsByAuthor(@Payload() data: { user: any; post: UpdatePublicationDto }): Promise<void> {
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
