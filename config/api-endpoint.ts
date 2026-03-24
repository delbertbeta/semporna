export const API_ENDPOINTS = {
  dev: 'https://brando-dev-api.delbertbeta.life',
  staging: 'https://brando-staging-api.delbertbeta.life',
  prod: 'https://brando-api.delbertbeta.life',
} as const;

export type AppEnv = keyof typeof API_ENDPOINTS;

export const DEFAULT_APP_ENV: AppEnv = 'dev';

export const resolveApiEndpoint = (appEnv: string | undefined): string => {
  if (appEnv && appEnv in API_ENDPOINTS) {
    return API_ENDPOINTS[appEnv as AppEnv];
  }

  return API_ENDPOINTS[DEFAULT_APP_ENV];
};
