import {DictEntry} from '../models/DictEntry.model';

export interface ECDEntriesResponse {
  totalHits: number;
  list: DictEntry[];
}
