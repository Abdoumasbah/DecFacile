export class LexicalFunction {
  lexicalFunction: string = "";
  type: string = "";

  static fromJson(json: any): LexicalFunction {
    return Object.assign(new LexicalFunction(), json);
  }

  toJson(): any {
    return {
      lexicalFunction: this.lexicalFunction,
      type: this.type

    };
  }
}
