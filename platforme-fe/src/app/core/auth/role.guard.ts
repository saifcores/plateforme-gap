import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

import { AuthService } from "./auth.service";
import { RoleCode } from "./auth.models";

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const roles = route.data["roles"] as RoleCode[] | undefined;

  if (!roles?.length || auth.hasAnyRole(roles)) {
    return true;
  }

  return router.createUrlTree(["/forbidden"]);
};
