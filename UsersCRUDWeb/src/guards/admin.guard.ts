import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const token = auth.getToken();
  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const role = payload['role'];

    if (role === 'Admin') {
      return true;
    }
  } catch (e) {
    console.error('Error decoding JWT in adminGuard', e);
  }

  router.navigate(['/home']);
  return false;
};
