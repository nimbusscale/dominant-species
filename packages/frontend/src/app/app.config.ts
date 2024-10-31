import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { apiUrlInterceptor } from './engine/interceptor/api-url.interceptor';
import { authInterceptor } from './engine/interceptor/auth.interceptor';
import { errorHandlerInterceptor } from './engine/interceptor/error-handler.interceptor';
import {CognitoIdentityProviderClient} from "@aws-sdk/client-cognito-identity-provider";
import {environment} from "../environments/environment";

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withFetch(),
      withInterceptors([apiUrlInterceptor, authInterceptor, errorHandlerInterceptor]),
    ),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync('noop'),
    {
      provide: CognitoIdentityProviderClient,
      useFactory: () => new CognitoIdentityProviderClient({ region: environment.cognito.region }),
    },
  ],
};
