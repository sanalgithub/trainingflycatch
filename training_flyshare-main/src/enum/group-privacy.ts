export enum GroupStatus {
  PRIVATE = 'private',
  PUBLIC = 'public',
}
export interface StatusType {
  status: GroupStatus.PRIVATE | GroupStatus.PUBLIC;
}
