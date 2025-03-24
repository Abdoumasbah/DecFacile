import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {ILanguage} from '../interfaces/Language.interface';
import {LanguageModel} from '../models/Language.model';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  constructor() { }

  private BASE_URL = 'LexO-backend/service/statistics/dictionary/languages';
  private http = inject(HttpClient);

  getAll(): Observable<ILanguage[]> {
    return this.http.get<ILanguage[]>(this.BASE_URL).pipe(
      map(response => response.map(item => LanguageModel.fromJson(item)))
    );
  }
}
