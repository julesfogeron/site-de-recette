import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IRecette, NewRecette } from '../recette.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IRecette for edit and NewRecetteFormGroupInput for create.
 */
type RecetteFormGroupInput = IRecette | PartialWithRequiredKeyOf<NewRecette>;

type RecetteFormDefaults = Pick<NewRecette, 'id'>;

type RecetteFormGroupContent = {
  id: FormControl<IRecette['id'] | NewRecette['id']>;
  nom: FormControl<IRecette['nom']>;
  description: FormControl<IRecette['description']>;
  contenu: FormControl<IRecette['contenu']>;
};

export type RecetteFormGroup = FormGroup<RecetteFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class RecetteFormService {
  createRecetteFormGroup(recette: RecetteFormGroupInput = { id: null }): RecetteFormGroup {
    const recetteRawValue = {
      ...this.getFormDefaults(),
      ...recette,
    };
    return new FormGroup<RecetteFormGroupContent>({
      id: new FormControl(
        { value: recetteRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nom: new FormControl(recetteRawValue.nom),
      description: new FormControl(recetteRawValue.description),
      contenu: new FormControl(recetteRawValue.contenu),
    });
  }

  getRecette(form: RecetteFormGroup): IRecette | NewRecette {
    return form.getRawValue() as IRecette | NewRecette;
  }

  resetForm(form: RecetteFormGroup, recette: RecetteFormGroupInput): void {
    const recetteRawValue = { ...this.getFormDefaults(), ...recette };
    form.reset(
      {
        ...recetteRawValue,
        id: { value: recetteRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): RecetteFormDefaults {
    return {
      id: null,
    };
  }
}
