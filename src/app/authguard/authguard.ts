import { CanActivateFn } from '@angular/router';

export const Authguard: CanActivateFn = (route, state) => {
  const role = typeof window !== 'undefined'
    ? localStorage.getItem('role')
    : null;
  const allowedRoles = route.data?.['roles'];

  if (allowedRoles && !allowedRoles.includes(role)) {
    if (typeof window !== 'undefined') {
      alert('Access Denied');
    }
    return false;
  }

  return true;
};