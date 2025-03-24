import {Injectable, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DictEntry} from '../models/DictEntry.model';
import {ECDEntriesResponse} from '../interfaces/ECDEntriesResponse.interface';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {DictEntryE} from '../models/DictEntryE.model';

@Injectable({
  providedIn: 'root',
})
export class DictEntryService {
  private BASE_URL = 'LexO-backend/service/ecd/data/';
  private http = inject(HttpClient);
  private dictEntryE: DictEntryE = new DictEntryE();

  getAll(): Observable<ECDEntriesResponse> {
    return this.http.post<ECDEntriesResponse>(
      this.BASE_URL + 'ECDEntries',
      this.dictEntryE.toJson()
    ).pipe(
      map(response => ({
          ...response,
          list: response.list.map(entry => DictEntry.fromJson(entry))
        })
      )
    );
  }

  getById(id: string): Observable<DictEntry> {
    const encodedId = encodeURIComponent(id);
    return this.http.get<DictEntry>(`${this.BASE_URL}ECDEntryTree?id=${encodedId}`).pipe(
      map(entryJson => DictEntry.fromJson(entryJson))
    );
  }
}
