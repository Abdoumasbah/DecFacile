export class LexicalFunctionModel {
  creator: string | null = null;
  lastUpdate: string | null = null;
  creationDate: string | null = null;
  confidence: number = 0;
  id: string = '';
  lexicalFunction: string = '';
  type: string = '';
  govPattern: string = '';
  fusedElement: boolean = false;
  senseTarget: string = '';
  definition: string = '';
  pos: string = '';
  lexicalEntryLabel: string = '';
  dictionaryEntryLabel: string = '';

  static fromJson(json: any): LexicalFunctionModel {
    return Object.assign(new LexicalFunctionModel(), json);
  }

  toJson(): any {
    return {
      creator: this.creator,
      lastUpdate: this.lastUpdate,
      creationDate: this.creationDate,
      confidence: this.confidence,
      id: this.id,
      lexicalFunction: this.lexicalFunction,
      type: this.type,
      govPattern: this.govPattern,
      fusedElement: this.fusedElement,
      senseTarget: this.senseTarget,
      definition: this.definition,
      pos: this.pos,
      lexicalEntryLabel: this.lexicalEntryLabel,
      dictionaryEntryLabel: this.dictionaryEntryLabel,
    };
  }
}
