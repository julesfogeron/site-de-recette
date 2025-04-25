import { IRecette, NewRecette } from './recette.model';

export const sampleWithRequiredData: IRecette = {
  id: 4656,
};

export const sampleWithPartialData: IRecette = {
  id: 14334,
  nom: 'en outre de',
};

export const sampleWithFullData: IRecette = {
  id: 1257,
  nom: 'de manière à ce que hypocrite rudement',
  description: 'partenaire longtemps',
  contenu: 'magenta à moins de puisque',
};

export const sampleWithNewData: NewRecette = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
