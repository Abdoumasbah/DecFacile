export interface IMorphology {
  trait: string;
  value: string;
}

export interface IForms {
  creator: string | null;
  lastUpdate: string | null;
  creationDate: string | null;
  confidence: number;
  morphology: IMorphology[];
  inheritedMorphology: IMorphology[];
  type: string;
  label: string;
  note: string;
  phoneticRep: string;
  form: string;
  pos: string;
}
