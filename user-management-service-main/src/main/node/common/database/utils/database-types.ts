import { BaseModel } from '@app/common/database/models/base.model';

export type AbstractConstructor<A = object> = abstract new (
  ...input: any[]
) => A;

type KeysOfType<T, U> = { [K in keyof T]: T[K] extends U ? K : never }[keyof T];

export type ReferenceKeys<T extends BaseModel | undefined> = Exclude<
  KeysOfType<T, BaseModel | string>,
  KeysOfType<T, string>
>;
