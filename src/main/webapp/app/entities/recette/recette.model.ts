export interface IRecette {
  id: number;
  nom?: string | null;
  description?: string | null;
  contenu?: string | null;
}

export type NewRecette = Omit<IRecette, 'id'> & { id: null };
