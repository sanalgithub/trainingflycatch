import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import {
  ModelUtils,
  Page,
  Pageable,
  QueryByExampleMongooseRepository,
  ReferenceKeys,
} from '@app/common/database';
import { UserSearch } from '@app/user/dto/user-search.dto';
import { User } from '@app/user/models/user.models';
import { UserRepository } from '@app/user/repository/user.repository';

@Injectable({})
export class MongooseUserRepository extends QueryByExampleMongooseRepository(
  User,
  UserRepository,
) {
  constructor(@InjectModel(User.name) readonly model: Model<User>) {
    super();
  }

  findBySearch(
    search: UserSearch,
    pageable: Pageable,
    ...joins: ReferenceKeys<User>[]
  ): Promise<Page<User>> {
    const query = this.model.find(this.buildSearchQuery(search));
    ModelUtils.populate(query, joins);
    return this.paginate(query, pageable);
  }

  async existsByEmailOrPhoneNumber(
    email?: string,
    phoneNumber?: string,
  ): Promise<boolean> {
    const or: FilterQuery<User>[] = [];
    if (email) {
      or.push({ email });
    }

    if (phoneNumber) {
      or.push({ phoneNumber });
    }

    const userCount = await this.model.countDocuments({
      $or: or,
    });
    return userCount != 0;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return (await this.model.findOne({ email }))?.toObject();
  }

  async findByPhoneNumber(phoneNumber: string): Promise<User | undefined> {
    return (await this.model.findOne({ phoneNumber }))?.toObject();
  }

  private buildSearchQuery(search: UserSearch): FilterQuery<User> {
    const query: FilterQuery<User> = {};
    if (search.email) {
      query.email = search.email;
    }
    if (search.firstName) {
      query.firstName = search.firstName;
    }
    if (search.lastName) {
      query.lastName = search.lastName;
    }
    if (search.middleName) {
      query.middleName = search.middleName;
    }
    if (search.phoneNumber) {
      query.phoneNumber = search.phoneNumber;
    }
    if (search.enabled !== undefined) {
      query.enabled = search.enabled;
    }
    if (search.q) {
      query.$or = [
        {
          firstName: { $regex: search.q, $options: 'i' },
        },
        {
          lastName: { $regex: search.q, $options: 'i' },
        },
        {
          middleName: { $regex: search.q, $options: 'i' },
        },
        {
          email: { $regex: search.q, $options: 'i' },
        },
        {
          phoneNumber: { $regex: search.q, $options: 'i' },
        },
      ];
    }

    return query;
  }
}
