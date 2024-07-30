export const constants = {
  IS_ENTITY: Symbol('isEntity'),
  IS_MODIFIED: Symbol('isModified'),
  MONGOOSE_REPOSITORY_LOGGER_NAME: 'mongo',

  PAGE_SHOULD_BE_POSITIVE: 'page should be a postive number',
  PAGE_SHOULD_BE_INTEGER: 'page should be an integer',
  SIZE_SHOULD_BE_POSITIVE: 'size should be a postive number',
  SIZE_SHOULD_BE_INTEGER: 'size should be an integer',

  SORT_SHOULD_BE_A_STRING: 'sort should be a string',
  INVALID_SORT_STRING: 'invalid sort string',

  INVALID_OBJECT_ID: 'invalid object id',
  DEFAULT_PAGE_NUMBER: 1,
  DEFAULT_PAGE_SIZE: 20,

  SORT_STRING_PATTERN: /^([^:\s]+(?::(?:ASC|DESC|asc|desc))*,*)*$/,
};
