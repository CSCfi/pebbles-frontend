import { authInterceptor } from "../app/interceptors/auth.interceptor";

export const ENVIRONMENT_SPECIFIC_INTERCEPTORS = [
  authInterceptor,
];

export const buildConfiguration = {
  production: true,
  apiUrl: 'api/v1'
};
