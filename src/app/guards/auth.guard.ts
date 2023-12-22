import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {

  //? Injecter le service d'authentification et le router avec inject()
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  //? Vérifier l'authentification
  if (authService.currentUserSubject.value) {
    return true;
  } else {
    router.navigate(['/home'])
    return false;
  }
};
