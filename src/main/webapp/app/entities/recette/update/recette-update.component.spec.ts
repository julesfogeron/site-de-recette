import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { RecetteService } from '../service/recette.service';
import { IRecette } from '../recette.model';
import { RecetteFormService } from './recette-form.service';

import { RecetteUpdateComponent } from './recette-update.component';

describe('Recette Management Update Component', () => {
  let comp: RecetteUpdateComponent;
  let fixture: ComponentFixture<RecetteUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let recetteFormService: RecetteFormService;
  let recetteService: RecetteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RecetteUpdateComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(RecetteUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RecetteUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    recetteFormService = TestBed.inject(RecetteFormService);
    recetteService = TestBed.inject(RecetteService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should update editForm', () => {
      const recette: IRecette = { id: 7863 };

      activatedRoute.data = of({ recette });
      comp.ngOnInit();

      expect(comp.recette).toEqual(recette);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRecette>>();
      const recette = { id: 25305 };
      jest.spyOn(recetteFormService, 'getRecette').mockReturnValue(recette);
      jest.spyOn(recetteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ recette });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: recette }));
      saveSubject.complete();

      // THEN
      expect(recetteFormService.getRecette).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(recetteService.update).toHaveBeenCalledWith(expect.objectContaining(recette));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRecette>>();
      const recette = { id: 25305 };
      jest.spyOn(recetteFormService, 'getRecette').mockReturnValue({ id: null });
      jest.spyOn(recetteService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ recette: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: recette }));
      saveSubject.complete();

      // THEN
      expect(recetteFormService.getRecette).toHaveBeenCalled();
      expect(recetteService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRecette>>();
      const recette = { id: 25305 };
      jest.spyOn(recetteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ recette });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(recetteService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
