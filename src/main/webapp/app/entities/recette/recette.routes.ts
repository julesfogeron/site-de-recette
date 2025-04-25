import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import RecetteResolve from './route/recette-routing-resolve.service';

const recetteRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/recette.component').then(m => m.RecetteComponent),
    data: {},
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/recette-detail.component').then(m => m.RecetteDetailComponent),
    resolve: {
      recette: RecetteResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/recette-update.component').then(m => m.RecetteUpdateComponent),
    resolve: {
      recette: RecetteResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/recette-update.component').then(m => m.RecetteUpdateComponent),
    resolve: {
      recette: RecetteResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default recetteRoute;
