import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IRecette } from '../recette.model';
import { RecetteService } from '../service/recette.service';

const recetteResolve = (route: ActivatedRouteSnapshot): Observable<null | IRecette> => {
  const id = route.params.id;
  if (id) {
    return inject(RecetteService)
      .find(id)
      .pipe(
        mergeMap((recette: HttpResponse<IRecette>) => {
          if (recette.body) {
            return of(recette.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default recetteResolve;
