import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from "@nestjs/typeorm";
import { PublicationsService } from "./publications.service";
import { PublicationEntity } from "../../../libs/entities/publications/publication.entity";
import { PublicationsModule } from "./publications.module";


describe('PublicationsService', () => {
  let publicationsService: PublicationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PublicationsModule],
      providers: [
        PublicationsService,
        {
          provide: getRepositoryToken(PublicationEntity),
          useValue: {
            update: jest.fn(),
            find: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          }
        },
      ],
    }).compile();

    publicationsService = module.get<PublicationsService>(PublicationsService);

  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(publicationsService).toBeDefined();
  });


});
