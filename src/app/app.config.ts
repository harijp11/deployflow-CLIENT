import { ApplicationConfig, provideBrowserGlobalErrorListeners} from '@angular/core';

import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

import {provideClientHydration, withEventReplay} from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

    // Application routing
    provideRouter(routes),

    // HTTP communication with backend services
    provideHttpClient(),

    // Preserve existing SSR hydration
    provideClientHydration(withEventReplay()),
  ],
};