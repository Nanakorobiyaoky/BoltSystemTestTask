import { GatewayTimeoutException, HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, defaultIfEmpty, firstValueFrom, throwError, timeout } from 'rxjs';
import { CreatePublicationDto } from '../../../../libs/dto/publications/create-publication.dto';
import { FilesService } from './files/files.service';
import { UpdatePublicationDto } from '../../../../libs/dto/publications/update-publication.dto';
import { ONLY_PUBLISHED } from '../../../../libs/constants/constants';
import { DeletePublicationByAuthorDto } from '../../../../libs/dto/publications/delete-publication-by-author.dto';

@Injectable()
export class PublicationsService {
  constructor(
    @Inject('PUBLICATIONS') private readonly client: ClientProxy,
    private readonly filesService: FilesService,
  ) {}

  async sendMessage(pattern: { cmd: string }, payload: any): Promise<any> {
    return await firstValueFrom(
      this.client.send(pattern, payload).pipe(
        timeout({
          each: 5000,
          with: () => throwError(() => new GatewayTimeoutException()),
        }),
        catchError((error) => {
          return throwError(() => new HttpException(error.message, error.status));
        }),
        defaultIfEmpty(null),
      ),
    );
  }
  async createPublication(publicationData: CreatePublicationDto, image: any, req: Request) {
    publicationData.authorId = req['user'].id;
    if (image) {
      publicationData.image = this.filesService.createImageName(image);
    }
    const pattern = { cmd: 'createPublication' };
    const publication = await this.sendMessage(pattern, publicationData);
    if (image) {
      try {
        await this.filesService.saveImage(image, publication.image);
      } catch (error) {
        const pattern = { cmd: 'updatePublication' };
        const data: UpdatePublicationDto = { id: publication.id, image: null };
        await this.sendMessage(pattern, data);
        throw error;
      }
    }
    return publication;
  }

  async updatePublicationByAuthor(publicationData, req) {
    let imageName;
    if (publicationData.image === '') {
      // @ts-ignore
      const publication = await this.getPublicationById(publicationData.id);
      imageName = publication.image;
    }
    const pattern = { cmd: 'updatePublicationByAuthor' };
    const result = await this.sendMessage(pattern, { post: publicationData, user: req['user'] });
    if (result && imageName) {
      await this.filesService.deleteImage(imageName);
    }
    return result;
  }

  async updatePublicationByEditor(publicationData) {
    if (publicationData.image === '') {
      // @ts-ignore
      const publication = await this.getPublicationById(publicationData.id);
      await this.filesService.deleteImage(publication.image);
    }

    const pattern = { cmd: 'updatePublicationByEditor' };
    return await this.sendMessage(pattern, publicationData);
  }

  async updatePublication(publicationData: UpdatePublicationDto, req: Request, image: any) {
    if (image) {
      publicationData.image = this.filesService.createImageName(image);
    }
    if (publicationData.isPublished) {
      publicationData.isPublished = publicationData.isPublished === 'true';
    }

    let result;
    if (req.hasOwnProperty('sameUser')) {
      result = await this.updatePublicationByAuthor(publicationData, req);
    } else {
      result = await this.updatePublicationByEditor(publicationData);
    }
    if (image) {
      try {
        await this.filesService.saveImage(image, publicationData.image);
      } catch (error) {
        const pattern = { cmd: 'updatePublication' };
        await this.sendMessage(pattern, { id: publicationData.id, image: '' });
        throw error;
      }
    }
    return result;
  }
  async getPublicationById(id: number, req: Request) {
    const pattern = { cmd: 'getPublicationById', onlyPublished: req ? req[ONLY_PUBLISHED] : false };
    return await this.sendMessage(pattern, id);
  }
  async getAllPublications(req: Request) {
    const pattern = { cmd: 'getAllPublications', onlyPublished: req[ONLY_PUBLISHED] };
    return await this.sendMessage(pattern, {});
  }
  async deletePublicationById(id: number, req: Request) {
    if (req.hasOwnProperty('sameUser')) {
      const pattern = { cmd: 'deletePublicationByAuthor' };
      const data: DeletePublicationByAuthorDto = { publicationId: id, authorId: req['user'].id };
      return await this.sendMessage(pattern, data);
    }
    const pattern = { cmd: 'deletePublication' };
    return await this.sendMessage(pattern, id);
  }
}
