import { GroupStatus } from '../../enum/group-privacy';

export class UpdateGroupRequest {
  name: string;
  description: string;
  status: GroupStatus.PRIVATE | GroupStatus.PUBLIC;
  users: string;
  admin: string;
  moderator: string;
}
