import { resolve } from 'path';

export const constants = {
  CONFIG_PATH: resolve(__dirname, '../../../resources/application.config.yaml'),
} as const;
