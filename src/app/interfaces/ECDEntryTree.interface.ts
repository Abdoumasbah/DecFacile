import {ECDEntryTree} from '../models/ECDEntryTree.model';

export interface IECDEntryTree {

  creator: string;
  lastUpdate: string;
  creationDate: string;
  confidence: number;
  id: string;
  referredEntity: string;
  type: string[];
  label: string;
  pos: string[];
  definition : string;
  senseNumber: number;
  children: ECDEntryTree[] ;
}
