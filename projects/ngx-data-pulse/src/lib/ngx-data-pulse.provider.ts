import {
  APP_INITIALIZER,
  EnvironmentProviders,
  Injector,
  makeEnvironmentProviders,
} from "@angular/core";
import { injector as globalInjector } from "./shared/injector";

export function provideNgxDataPulse(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: APP_INITIALIZER,
      useFactory: (injector: Injector) => {
        return () => {
          globalInjector.set(injector);
        };
      },
      deps: [Injector],
      multi: true,
    },
  ]);
}
