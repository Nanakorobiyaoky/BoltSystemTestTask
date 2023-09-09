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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { PublicationEntity } from '../../../../libs/entities/publications/publication.entity';
import { CreatePublicationDto } from '../../../../libs/dto/publications/create-publication.dto';
import { UpdatePublicationDto } from '../../../../libs/dto/publications/update-publication.dto';
import { RequiredRolesDecorator } from '../../../../libs/decorators/required-roles.decorator';
import { ClientUserRolesEnum } from '../../../../libs/enums/client-user-roles.enum';
import { RoleGuard } from '../../../../libs/guards/role.guard';
import { JwtAuthGuard } from '../../../../libs/guards/jwt-auth.guard';
import { RequiredRolesForHimselfDecorator } from '../../../../libs/decorators/required-role-for-himself.decorator';
import { SystemUserRolesEnum } from '../../../../libs/enums/system-user-roles.enum';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('publications')
export class PublicationsController {
  constructor(private readonly publicationsService: PublicationsService) {}

  @Get()
  async getAllPublications(@Req() req: Request): Promise<PublicationEntity[]> {
    return await this.publicationsService.getAllPublications(req);
  }

  @Get(':id')
  async getPublicationById(@Param('id', ParseIntPipe) id: number, @Req() req: Request): Promise<PublicationEntity[]> {
    return await this.publicationsService.getPublicationById(id, req);
  }

  @RequiredRolesDecorator([ClientUserRolesEnum.AUTHOR, ClientUserRolesEnum.EDITOR])
  @UseGuards(JwtAuthGuard, RoleGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  async createPublication(
    @Body() data: CreatePublicationDto,
    @UploadedFile() image: any,
    @Req() req,
  ): Promise<PublicationEntity> {
    return this.publicationsService.createPublication(data, image, req);
  }

  @RequiredRolesDecorator([ClientUserRolesEnum.EDITOR, SystemUserRolesEnum.ADMIN])
  @RequiredRolesForHimselfDecorator([ClientUserRolesEnum.AUTHOR])
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Put()
  updatePublication(
    @Body() data: UpdatePublicationDto,
    @Req() req: Request,
    @UploadedFile() image: any,
  ): Promise<void> {
    return this.publicationsService.updatePublication(data, req, image);
  }

  @RequiredRolesDecorator([ClientUserRolesEnum.EDITOR, SystemUserRolesEnum.ADMIN])
  @RequiredRolesForHimselfDecorator([ClientUserRolesEnum.AUTHOR])
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deletePublicationById(@Param('id', ParseIntPipe) id: number, @Req() req: Request): Promise<void> {
    return this.publicationsService.deletePublicationById(id, req);
  }
}
