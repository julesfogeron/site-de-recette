import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { RecetteDetailComponent } from './recette-detail.component';

describe('Recette Management Detail Component', () => {
  let comp: RecetteDetailComponent;
  let fixture: ComponentFixture<RecetteDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecetteDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./recette-detail.component').then(m => m.RecetteDetailComponent),
              resolve: { recette: () => of({ id: 25305 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(RecetteDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecetteDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load recette on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', RecetteDetailComponent);

      // THEN
      expect(instance.recette()).toEqual(expect.objectContaining({ id: 25305 }));
    });
  });

  describe('PreviousState', () => {
    it('should navigate to previous state', () => {
      jest.spyOn(window.history, 'back');
      comp.previousState();
      expect(window.history.back).toHaveBeenCalled();
    });
  });
});
