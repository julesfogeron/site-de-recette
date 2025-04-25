import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IRecette } from '../recette.model';
import { RecetteService } from '../service/recette.service';
import { RecetteFormGroup, RecetteFormService } from './recette-form.service';

@Component({
  selector: 'jhi-recette-update',
  templateUrl: './recette-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class RecetteUpdateComponent implements OnInit {
  isSaving = false;
  recette: IRecette | null = null;

  protected recetteService = inject(RecetteService);
  protected recetteFormService = inject(RecetteFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: RecetteFormGroup = this.recetteFormService.createRecetteFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ recette }) => {
      this.recette = recette;
      if (recette) {
        this.updateForm(recette);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const recette = this.recetteFormService.getRecette(this.editForm);
    if (recette.id !== null) {
      this.subscribeToSaveResponse(this.recetteService.update(recette));
    } else {
      this.subscribeToSaveResponse(this.recetteService.create(recette));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRecette>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(recette: IRecette): void {
    this.recette = recette;
    this.recetteFormService.resetForm(this.editForm, recette);
  }
}
