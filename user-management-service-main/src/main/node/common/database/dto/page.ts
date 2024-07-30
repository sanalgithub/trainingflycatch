export class Page<T> {
  page!: number;
  size!: number;
  first!: boolean;
  last!: boolean;
  totalPages!: number;
  totalElements!: number;
  data!: T[];

  constructor(page: Partial<Page<T>>) {
    Object.assign(this, page);
  }

  map<E>(mapFunction: (data: T) => E): Page<E> {
    return new Page<E>({
      page: this.page,
      size: this.size,
      first: this.first,
      last: this.last,
      totalPages: this.totalPages,
      totalElements: this.totalElements,
      data: this.data.map(mapFunction),
    });
  }
}
