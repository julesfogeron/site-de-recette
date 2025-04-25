import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IRecette, NewRecette } from '../recette.model';

export type PartialUpdateRecette = Partial<IRecette> & Pick<IRecette, 'id'>;

export type EntityResponseType = HttpResponse<IRecette>;
export type EntityArrayResponseType = HttpResponse<IRecette[]>;

@Injectable({ providedIn: 'root' })
export class RecetteService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/recettes');

  create(recette: NewRecette): Observable<EntityResponseType> {
    return this.http.post<IRecette>(this.resourceUrl, recette, { observe: 'response' });
  }

  update(recette: IRecette): Observable<EntityResponseType> {
    return this.http.put<IRecette>(`${this.resourceUrl}/${this.getRecetteIdentifier(recette)}`, recette, { observe: 'response' });
  }

  partialUpdate(recette: PartialUpdateRecette): Observable<EntityResponseType> {
    return this.http.patch<IRecette>(`${this.resourceUrl}/${this.getRecetteIdentifier(recette)}`, recette, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IRecette>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IRecette[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getRecetteIdentifier(recette: Pick<IRecette, 'id'>): number {
    return recette.id;
  }

  compareRecette(o1: Pick<IRecette, 'id'> | null, o2: Pick<IRecette, 'id'> | null): boolean {
    return o1 && o2 ? this.getRecetteIdentifier(o1) === this.getRecetteIdentifier(o2) : o1 === o2;
  }

  addRecetteToCollectionIfMissing<Type extends Pick<IRecette, 'id'>>(
    recetteCollection: Type[],
    ...recettesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const recettes: Type[] = recettesToCheck.filter(isPresent);
    if (recettes.length > 0) {
      const recetteCollectionIdentifiers = recetteCollection.map(recetteItem => this.getRecetteIdentifier(recetteItem));
      const recettesToAdd = recettes.filter(recetteItem => {
        const recetteIdentifier = this.getRecetteIdentifier(recetteItem);
        if (recetteCollectionIdentifiers.includes(recetteIdentifier)) {
          return false;
        }
        recetteCollectionIdentifiers.push(recetteIdentifier);
        return true;
      });
      return [...recettesToAdd, ...recetteCollection];
    }
    return recetteCollection;
  }
}
