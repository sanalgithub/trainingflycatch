import { IsArray, IsNotEmpty } from 'class-validator';

export class GroupTagRequest {
  @IsArray()
  @IsNotEmpty()
  grouptag: string[];
}
