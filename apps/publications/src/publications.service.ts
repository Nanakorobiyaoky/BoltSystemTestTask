import { HttpStatus, Injectable } from "@nestjs/common";
import { PublicationEntity } from "../../../libs/entities/publications/publication.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, In, Repository } from "typeorm";
import { CreatePublicationDto } from "../../../libs/dto/publications/create-publication.dto";
import { RpcException } from "@nestjs/microservices";
import { UpdatePublicationDto } from "../../../libs/dto/publications/update-publication.dto";
import { ClientUserEntity } from "../../../libs/entities/users/client-user.entity";
import { DeletePublicationByAuthorDto } from "../../../libs/dto/publications/delete-publication-by-author.dto";

@Injectable()
export class PublicationsService {
  constructor(
    @InjectRepository(PublicationEntity)
    private readonly publicationsRepository: Repository<PublicationEntity>,
    private dataSource: DataSource,
  ) {}

  async getAllPublications(onlyPublished: boolean): Promise<PublicationEntity[]> {
    return await this.publicationsRepository.find({
      where: {
        isPublished: onlyPublished ? true : In([true, false]),
      },
    });
  }

  async createPublication(data: CreatePublicationDto): Promise<PublicationEntity> {
    try {
      return await this.publicationsRepository.save(data);
    } catch (e) {
      throw new RpcException({ message: 'content and title fields must be unique', status: HttpStatus.BAD_REQUEST });
    }
  }

  async getPublicationById(id: number, onlyPublished: boolean): Promise<PublicationEntity> {
    const result = await this.publicationsRepository.findOne({
      where: {
        id: id,
      },
    });
    if (result) {
      if ((result.isPublished && onlyPublished) || !onlyPublished) return result;
    }
    throw new RpcException({ message: 'NOT FOUND', status: HttpStatus.NOT_FOUND });
  }

  async updatePublicationByEditor(data: UpdatePublicationDto): Promise<PublicationEntity> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      // @ts-ignore
      await queryRunner.manager.update(PublicationEntity, data.id, data);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw new RpcException({message: e.sqlMessage, status: HttpStatus.BAD_REQUEST})
    } finally {
      await queryRunner.release();
    }
    return await this.publicationsRepository.findOne({
      where: {
        id: data.id
      }
    })
  }

  async deletePublicationById(id: number): Promise<void> {
    const publication = await this.publicationsRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!publication) {
      throw new RpcException({ message: 'publication with this id does not exist', status: HttpStatus.BAD_REQUEST });
    }
    await this.publicationsRepository.delete(id);
  }

  async updatePublicationByAuthor(dto: { user: ClientUserEntity; post: UpdatePublicationDto }) {
    const data = dto.post;
    const user = dto.user;
    const publication = await this.publicationsRepository.findOne({
      where: {
        id: data.id,
      },
    });
    if (!publication) {
      throw new RpcException({ message: 'publication with this id does not exist', status: HttpStatus.BAD_REQUEST });
    }
    if (publication.authorId !== user.id) {
      throw new RpcException({ message: 'you cannot edit this publication', status: HttpStatus.BAD_REQUEST });
    }
    if (!user.mayPublish && data.isPublished) {
      throw new RpcException({ message: 'you cannot publish', status: HttpStatus.FORBIDDEN });
    }
    return await this.updatePublicationByEditor(data);
  }

  async deletePublicationByAuthor(data: DeletePublicationByAuthorDto) {
    const publication = await this.publicationsRepository.findOne({
      where: {
        id: data.publicationId
      },
    });
    if (!publication) {
      throw new RpcException({ message: 'publication with this id does not exist', status: HttpStatus.BAD_REQUEST });
    }
    if (publication.authorId !== data.authorId) {
      throw new RpcException({ message: 'you cannot delete this publication', status: HttpStatus.BAD_REQUEST });
    }
    await this.publicationsRepository.delete(data.publicationId);
  }
}
