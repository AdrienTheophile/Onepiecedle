import { ResultatsComparaison } from "./comparaison.model";
import { PersonnageModel } from "./personnage.model";

export interface ResultatTentative {
  personnage: PersonnageModel,
  comparaison: ResultatsComparaison
}
