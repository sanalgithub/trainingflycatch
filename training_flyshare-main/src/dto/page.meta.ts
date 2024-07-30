import { PageMetaDtoParameters } from './page.metaparameters';

export class PageMetaDto {
  readonly page: number;

  readonly take: number;

  readonly numberofelements: number;

  readonly totalPages: number;

  readonly hasPreviousPage: boolean;

  readonly hasNextPage: boolean;

  constructor({ pageOptionsDto, itemCount }: PageMetaDtoParameters) {
    this.page = pageOptionsDto.page;
    this.take = pageOptionsDto.take;
    this.numberofelements = itemCount;
    this.totalPages = Math.ceil(this.numberofelements / this.take);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.totalPages;
  }
}
