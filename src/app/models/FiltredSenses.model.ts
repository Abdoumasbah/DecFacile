export class FiltredSensesModel {
  creator: string = '';
  lastUpdate: string = '';
  creationDate: string = '';
  confidence: number = 0;
  sense: string = '';
  lexicalEntry: string = '';
  pos: string = '';
  lemma: string = '';
  hasChildren : boolean = false;
  label: string = '';
  definition : string = '';
  note: string = '';
  usage: string = '';
  concept: string = '';
  description: string = '';
  gloss: string = '';
  senseExample: string = '';
  senseTranslation: string = '';

  static fromJson(json: any): FiltredSensesModel {
    return Object.assign(new FiltredSensesModel(), json);
  }

  toJson(): any {
    return {
      creator: this.creator,
      lastUpdate: this.lastUpdate,
      creationDate: this.creationDate,
      confidence: this.confidence,
      sense: this.sense,
      lexicalEntry: this.lexicalEntry,
      pos: this.pos,
      lemma: this.lemma,
      hasChildren: this.hasChildren,
      label: this.label,
      definition : this.definition,
      note : this.note,
      usage : this.usage,
      concept : this.concept,
      description : this.description,
      gloss : this.gloss,
      senseExample : this.senseExample,
      senseTranslation : this.senseTranslation,
    };
  }
}
