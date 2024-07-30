import { Prop, Schema } from '@nestjs/mongoose';
import { BaseModel } from '@app/common/database';

@Schema({})
export class User extends BaseModel {
  @Prop({ type: 'string' })
  firstName!: string;

  @Prop({ type: 'string' })
  middleName!: string;

  @Prop({ type: 'string' })
  lastName!: string;

  @Prop({ type: 'string' })
  email!: string;

  @Prop({ type: 'string' })
  countryCode!: string;

  @Prop({ type: 'string' })
  phoneNumber!: string;

  @Prop({ type: 'string' })
  password!: string;

  @Prop({ type: 'boolean', default: false })
  enabled!: boolean;

  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }
}
