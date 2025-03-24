export class LanguageModel {
  label : string = '';
  count : number = 0;



  static fromJson(json: any): LanguageModel {
    return Object.assign(new LanguageModel(), json);
  }

  toJson(): any {
    return {
      label: this.label,
      count: this.count,
    };
  }
}
