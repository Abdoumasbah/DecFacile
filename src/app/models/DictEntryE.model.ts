export class DictEntryE {
  text: string = '';
  searchMode: string = 'startsWith';
  pos: string[] = [];
  author: string = '';
  lang: string = '';
  status: string = '';
  offset : number = 0;
  limit: number = 5000;


  static fromJson(json: any): DictEntryE {
    return Object.assign(new DictEntryE(), json);
  }

  toJson(): any {
    return {
      text: this.text,
      searchMode: this.searchMode,
      pos : [...this.pos],
      author: this.author,
      lang: this.lang,
      status: this.status,
      offset : this.offset,
      limit: this.limit,
    };
  }
}
