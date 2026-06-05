import { ApplicationConfig, provideZoneChangeDetection } from "@angular/core";
import { provideRouter } from "@angular/router";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";

import { routes } from "./app.routes";
import { authInterceptor } from "./core/auth/auth.interceptor";
import { errorInterceptor } from "./core/http/error.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    provideAnimationsAsync(),
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: "outline",
        subscriptSizing: "dynamic",
      },
    },
  ],
};
