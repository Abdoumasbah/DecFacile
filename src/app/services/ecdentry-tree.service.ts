import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {ECDEntryTree} from '../models/ECDEntryTree.model';
import {IECDEntryTree} from '../interfaces/ECDEntryTree.interface';
import {IForms} from '../interfaces/forms.interface';
import {Form} from '../models/Form.model';

@Injectable({
  providedIn: 'root'
})
export class ECDEntryTreeService {

  constructor() {
  }

  private BASE_URL = 'LexO-backend/service/ecd/data/';
  private http = inject(HttpClient);

  getByIdSense(id: string): Observable<IECDEntryTree[]> {
    const encodedId = encodeURIComponent(id);
    return this.http.get<IECDEntryTree[]>(`${this.BASE_URL}ECDEntrySemantics?id=${encodedId}`).pipe(
      map(entryJson => entryJson.map(item => ECDEntryTree.fromJson(item)))
    );
  }

  getByIdForms(id: string): Observable<IForms[]> {
    const encodedId = encodeURIComponent(id);
    return this.http.get<IForms[]>(`${this.BASE_URL}ECDEntryMorphology?id=${encodedId}`).pipe(
      map(entryJson => entryJson.map(item => Form.fromJson(item)))
    );
  }

  /*dictEntryService = inject(DictEntryService);

  getAllFormattedSenses(): Observable<string[]> {
    return this.dictEntryService.getAll().pipe(
      map(response => {
        let formattedSenses: string[] = [];

        const processSenses = (entryLabel: string, sensesList: IECDEntryTree[]) => {
          sensesList.forEach((sense) => {
            let senseLabel = `${entryLabel}_${sense.label}`;
            formattedSenses.push(senseLabel);

            // Si le sens a des enfants, on les traite récursivement
            if (sense.children && sense.children.length > 0) {
              processSenses(entryLabel, sense.children);
            }
          });
        };

        for (let dictEntry of response.list) {
          this.getByIdSense(dictEntry.dictionaryEntry).subscribe((sensesResponse) => {
            if (sensesResponse.length > 0) {
              processSenses(dictEntry.label, sensesResponse);
            }
          });
        }

        return formattedSenses;
      })
    );
  }
  */


}
