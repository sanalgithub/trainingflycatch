import { IsNotEmpty } from 'class-validator';
import { GroupStatus } from '../../enum/group-privacy';

export class CreateGroupRequest {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  status: GroupStatus.PRIVATE | GroupStatus.PUBLIC;
  @IsNotEmpty()
  users: string;
  @IsNotEmpty()
  admin: string;
  moderator: string;
}
