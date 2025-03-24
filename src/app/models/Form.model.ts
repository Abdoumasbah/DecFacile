import {IMorphology} from '../interfaces/forms.interface';

export class Form {
  creator: string = "";
  lastUpdate: string = "";
  creationDate: string = "";
  confidence: number = 0;
  morphology: IMorphology[] = [];
  inheritedMorphology: IMorphology[] = [];
  type: string = "";
  label: string = "";
  note: string = "";
  phoneticRep: string = "";
  form: string = "";
  pos: string = "";

  // Convertit un objet JSON en une instance de Sense
  static fromJson(json: any): Form {
    const sense = Object.assign(new Form(), json);
    sense.children = (json.children || []).map((child: any) => Form.fromJson(child));
    return sense;
  }

  // Sérialise une instance de Sense en JSON
  toJson(): any {
    return {
      creator: this.creator,
      lastUpdate: this.lastUpdate,
      creationDate: this.creationDate,
      confidence: this.confidence,
      morphology: this.morphology,
      inheritedMorphology: this.inheritedMorphology,
      type: this.type,
      label: this.label,
      note: this.note,
      phoneticRep: this.phoneticRep,
      form: this.form,
      pos: this.pos
    };
  }
}
