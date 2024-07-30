import { IsArray, IsNotEmpty } from 'class-validator';

export class TagRequest {
  @IsArray()
  @IsNotEmpty()
  tag: string[];
}
