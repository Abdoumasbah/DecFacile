import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {FiltredSensesEModel} from '../models/FiltredSensesE.model';
import {FiltredSensesModel} from '../models/FiltredSenses.model';
import {IFiltredSenses} from '../interfaces/FiltredSenses.interface';

@Injectable({
  providedIn: 'root'
})
export class SensesService {

  constructor() { }
  private BASE_URL = 'LexO-backend/service/data/';
  private http = inject(HttpClient);
  private filtredSensesE: FiltredSensesEModel = new FiltredSensesEModel();

  getAll(): Observable<IFiltredSenses> {
    return this.http.post<IFiltredSenses>(
      this.BASE_URL + 'filteredSenses',
      this.filtredSensesE.toJson()
    ).pipe(
      map(response => ({
          ...response,
          list: response.list.map(entry => FiltredSensesModel.fromJson(entry))
        })
      )
    );
  }
}
