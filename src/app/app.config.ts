import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.route';

export const appConfig: ApplicationConfig = {
  providers: [
    // Router configuration with input binding enabled for cleaner component interactions
    provideRouter(routes, withComponentInputBinding()),

    // Enable Angular Material animations
    provideAnimations(),

    // Provide HttpClient for API calls
    provideHttpClient(),
  ],
};
