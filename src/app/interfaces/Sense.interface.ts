export interface ISense {
  id: string;
  referredEntity: string;
  label: string;
  pos: string[];
  children: ISense[]; // Correction pour la cohérence
}
