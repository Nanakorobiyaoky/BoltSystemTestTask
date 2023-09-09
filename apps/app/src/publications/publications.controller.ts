import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { PublicationEntity } from '../../../../libs/entities/publications/publication.entity';
import { CreatePublicationDto } from '../../../../libs/dto/publications/create-publication.dto';
import { UpdatePublicationDto } from '../../../../libs/dto/publications/update-publication.dto';
import { RequiredRolesDecorator } from '../../../../libs/decorators/required-roles.decorator';
import { ClientUserRoles } from '../../../../libs/roles/client-user.roles';
import { RoleGuard } from '../../../../libs/guards/role.guard';
import { JwtAuthGuard } from '../../../../libs/guards/jwt-auth.guard';
import { RequiredRolesForHimselfDecorator } from '../../../../libs/decorators/required-role-for-himself.decorator';
import { SystemUserRoles } from '../../../../libs/roles/system-user.roles';
import { ONLY_PUBLISHED } from '../../../../libs/constants/constants';
import { DeletePublicationByAuthorDto } from '../../../../libs/dto/publications/delete-publication-by-author.dto';

@Controller('publications')
export class PublicationsController {
  constructor(private readonly publicationsService: PublicationsService) {}

  @Get()
  async getAllPublications(@Req() req: Request): Promise<PublicationEntity[]> {
    const pattern = { cmd: 'getAllPublications', onlyPublished: req[ONLY_PUBLISHED] };
    return await this.publicationsService.sendMessage(pattern, {});
  }

  @Get(':id')
  async getPublicationById(@Param('id', ParseIntPipe) id: number, @Req() req: Request): Promise<PublicationEntity[]> {
    const pattern = { cmd: 'getPublicationById', onlyPublished: req[ONLY_PUBLISHED] };
    return await this.publicationsService.sendMessage(pattern, id);
  }

  @RequiredRolesDecorator([ClientUserRoles.AUTHOR, ClientUserRoles.EDITOR])
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post()
  async createPublication(@Body() data: CreatePublicationDto): Promise<PublicationEntity> {
    const pattern = { cmd: 'createPublication' };
    return await this.publicationsService.sendMessage(pattern, data);
  }

  @RequiredRolesDecorator([ClientUserRoles.EDITOR, SystemUserRoles.ADMIN])
  @RequiredRolesForHimselfDecorator([ClientUserRoles.AUTHOR])
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put()
  updatePublication(@Body() data: UpdatePublicationDto, @Req() req: Request): Promise<void> {
    let pattern = { cmd: 'updatePublication' };
    if (req.hasOwnProperty('sameUser')) {
      pattern = { cmd: 'updatePublicationByAuthor' };
      return this.publicationsService.sendMessage(pattern, { post: data, user: req['user'] });
    }
    return this.publicationsService.sendMessage(pattern, data);
  }

  @RequiredRolesDecorator([ClientUserRoles.EDITOR, SystemUserRoles.ADMIN])
  @RequiredRolesForHimselfDecorator([ClientUserRoles.AUTHOR])
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deletePublicationById(@Param('id', ParseIntPipe) id: number, @Req() req: Request): Promise<void> {
    let pattern = { cmd: 'deletePublication' };
    if (req.hasOwnProperty('sameUser')) {
      pattern = { cmd: 'deletePublicationByAuthor' };
      const data: DeletePublicationByAuthorDto = { publicationId: id, authorId: req['user'].id };
      return this.publicationsService.sendMessage(pattern, data);
    }
    return this.publicationsService.sendMessage(pattern, id);
  }
}
