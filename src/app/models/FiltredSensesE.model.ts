export class FiltredSensesEModel {
  text: string = '';
  searchMode: string = 'equals';
  type: string = '';
  field: string = '';
  pos: string = '';
  formType: string = 'entry';
  author: string = '';
  lang: string = '';
  status: string = '';
  offset : number = 0;
  limit: number = 500;



  static fromJson(json: any): FiltredSensesEModel {
    return Object.assign(new FiltredSensesEModel(), json);
  }

  toJson(): any {
    return {
      text: this.text,
      searchMode: this.searchMode,
      type : this.type,
      field : this.field,
      pos : this.pos,
      formType : this.formType,
      author: this.author,
      lang: this.lang,
      status: this.status,
      offset : this.offset,
      limit: this.limit,
    };
  }
}
