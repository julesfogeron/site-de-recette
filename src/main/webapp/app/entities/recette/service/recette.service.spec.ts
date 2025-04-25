import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IRecette } from '../recette.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../recette.test-samples';

import { RecetteService } from './recette.service';

const requireRestSample: IRecette = {
  ...sampleWithRequiredData,
};

describe('Recette Service', () => {
  let service: RecetteService;
  let httpMock: HttpTestingController;
  let expectedResult: IRecette | IRecette[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(RecetteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Recette', () => {
      const recette = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(recette).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Recette', () => {
      const recette = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(recette).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Recette', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Recette', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Recette', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addRecetteToCollectionIfMissing', () => {
      it('should add a Recette to an empty array', () => {
        const recette: IRecette = sampleWithRequiredData;
        expectedResult = service.addRecetteToCollectionIfMissing([], recette);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(recette);
      });

      it('should not add a Recette to an array that contains it', () => {
        const recette: IRecette = sampleWithRequiredData;
        const recetteCollection: IRecette[] = [
          {
            ...recette,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addRecetteToCollectionIfMissing(recetteCollection, recette);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Recette to an array that doesn't contain it", () => {
        const recette: IRecette = sampleWithRequiredData;
        const recetteCollection: IRecette[] = [sampleWithPartialData];
        expectedResult = service.addRecetteToCollectionIfMissing(recetteCollection, recette);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(recette);
      });

      it('should add only unique Recette to an array', () => {
        const recetteArray: IRecette[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const recetteCollection: IRecette[] = [sampleWithRequiredData];
        expectedResult = service.addRecetteToCollectionIfMissing(recetteCollection, ...recetteArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const recette: IRecette = sampleWithRequiredData;
        const recette2: IRecette = sampleWithPartialData;
        expectedResult = service.addRecetteToCollectionIfMissing([], recette, recette2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(recette);
        expect(expectedResult).toContain(recette2);
      });

      it('should accept null and undefined values', () => {
        const recette: IRecette = sampleWithRequiredData;
        expectedResult = service.addRecetteToCollectionIfMissing([], null, recette, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(recette);
      });

      it('should return initial array if no Recette is added', () => {
        const recetteCollection: IRecette[] = [sampleWithRequiredData];
        expectedResult = service.addRecetteToCollectionIfMissing(recetteCollection, undefined, null);
        expect(expectedResult).toEqual(recetteCollection);
      });
    });

    describe('compareRecette', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareRecette(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 25305 };
        const entity2 = null;

        const compareResult1 = service.compareRecette(entity1, entity2);
        const compareResult2 = service.compareRecette(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 25305 };
        const entity2 = { id: 7863 };

        const compareResult1 = service.compareRecette(entity1, entity2);
        const compareResult2 = service.compareRecette(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 25305 };
        const entity2 = { id: 25305 };

        const compareResult1 = service.compareRecette(entity1, entity2);
        const compareResult2 = service.compareRecette(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
