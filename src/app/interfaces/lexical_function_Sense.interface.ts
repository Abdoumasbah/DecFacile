export interface ILexicalFunctionSense {
  creator: string | null;
  lastUpdate: string | null;
  creationDate: string | null;
  confidence: number;
  id: string;
  lexicalFunction: string;
  type: string;
  govPattern: string;
  fusedElement: boolean;
  senseTarget: string;
  definition: string;
  pos: string;
  lexicalEntryLabel: string;
  dictionaryEntryLabel: string;
}
