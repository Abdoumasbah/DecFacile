export class ECDEntryTree {
  creator: string = '';
  lastUpdate: string = '';
  creationDate: string = '';
  confidence: number = 0;
  id: string = '';
  referredEntity: string = '';
  type: string[] = [];
  label: string = '';
  pos: string[] = [];
  definition : string = '';
  senseNumber: number = 0;
  children: ECDEntryTree[] = [];

  static fromJson(json: any): ECDEntryTree {
    return Object.assign(new ECDEntryTree(), json);
  }

  toJson(): any {
    return {
      creator: this.creator,
      lastUpdate: this.lastUpdate,
      creationDate: this.creationDate,
      confidence: this.confidence,
      id: this.id,
      referredEntity: this.referredEntity,
      type: [...this.type],
      label: this.label,
      pos: [...this.pos],
      definition : this.definition,
      senseNumber: this.senseNumber,
      children: this.children,
    };
  }
}
