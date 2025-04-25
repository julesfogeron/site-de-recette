import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../recette.test-samples';

import { RecetteFormService } from './recette-form.service';

describe('Recette Form Service', () => {
  let service: RecetteFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecetteFormService);
  });

  describe('Service methods', () => {
    describe('createRecetteFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createRecetteFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nom: expect.any(Object),
            description: expect.any(Object),
            contenu: expect.any(Object),
          }),
        );
      });

      it('passing IRecette should create a new form with FormGroup', () => {
        const formGroup = service.createRecetteFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nom: expect.any(Object),
            description: expect.any(Object),
            contenu: expect.any(Object),
          }),
        );
      });
    });

    describe('getRecette', () => {
      it('should return NewRecette for default Recette initial value', () => {
        const formGroup = service.createRecetteFormGroup(sampleWithNewData);

        const recette = service.getRecette(formGroup) as any;

        expect(recette).toMatchObject(sampleWithNewData);
      });

      it('should return NewRecette for empty Recette initial value', () => {
        const formGroup = service.createRecetteFormGroup();

        const recette = service.getRecette(formGroup) as any;

        expect(recette).toMatchObject({});
      });

      it('should return IRecette', () => {
        const formGroup = service.createRecetteFormGroup(sampleWithRequiredData);

        const recette = service.getRecette(formGroup) as any;

        expect(recette).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IRecette should not enable id FormControl', () => {
        const formGroup = service.createRecetteFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewRecette should disable id FormControl', () => {
        const formGroup = service.createRecetteFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
