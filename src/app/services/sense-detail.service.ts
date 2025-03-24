import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SenseDetail} from '../models/SenseDetail.model';
import {Observable} from 'rxjs';
import {ISenseDetail} from '../interfaces/ISenseDetail.interface';
import {map} from 'rxjs/operators';
import {ILexicalFunctionSense} from '../interfaces/lexical_function_Sense.interface';
import {LexicalFunctionModel} from '../models/Lexical_function_Sense.model';

@Injectable({
  providedIn: 'root'
})
export class SenseDetailService {

  private DATA_URL = 'LexO-backend/service/data/lexicalSense';
  private UPDATE_URL = 'LexO-backend/service/update/lexicalSense';
  private LF_URL = 'LexO-backend/service/ecd/data/ECDLexicaFunctions';
  private ADD_GR_URL = 'LexO-backend/service/update/genericRelation';
  private DELETE_GR_URL = 'LexO-backend/service/delete/relation';
  private http = inject(HttpClient);

  constructor() { }

  getSenseDetail(senseId: string): Observable<SenseDetail> {
    const params = new URLSearchParams({
      module: 'core',
      id: senseId
    });

    const url = `${this.DATA_URL}?${params.toString()}`;

    return this.http.get<ISenseDetail>(url).pipe(
      map((response) => SenseDetail.fromJson(response))
    );
  }

  getLFById(senseId: string): Observable<ILexicalFunctionSense[]> {
    const encodedId = encodeURIComponent(senseId);
    return this.http.get<ILexicalFunctionSense[]>(`${this.LF_URL}?id=${encodedId}`).pipe(
      map(entryJson =>
        Array.isArray(entryJson)
          ? entryJson.map(item => LexicalFunctionModel.fromJson(item))
          : [LexicalFunctionModel.fromJson(entryJson)]
      )
    );
  }

  updateSenseDefinition(senseId: string, newDefinition: string, oldDefinition: string): Observable<any> {
    if (!senseId) {
      console.error("Error: senseId is missing!");
      throw new Error("Missing senseId parameter!");
    }

    // ✅ Ensure proper escaping of quotes
    const escapedDefinition = newDefinition
      .replace(/\\/g, '\\\\')  // Escape backslashes
      .replace(/"/g, '\\"');   // Escape double quotes (important for JSON)

    // ✅ Construct payload correctly
    const updatePayload = {
      relation: "http://www.w3.org/2004/02/skos/core#definition",
      value: escapedDefinition,  // Use properly escaped definition
      currentValue: oldDefinition
    };

   // console.log("🚀 Sending payload:", JSON.stringify(updatePayload));  // Debugging

    return this.http.post(`${this.UPDATE_URL}?id=${encodeURIComponent(senseId)}`, updatePayload, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'text'  // ✅ Expect plain text response instead of JSON
    }).pipe(
      map(response => {
      //  console.log("✅ Server Response:", response);
        return { success: true, message: response }; // Wrap text response in an object
      })
    );
  }

  addGenericRelation(senseId: string, newSense: string): Observable<any> {
    if (!senseId) {
      console.error("Error: senseId is missing!");
      throw new Error("Missing senseId parameter!");
    }

    newSense = newSense.trim().replace(/['"\\]+/g, '');

    // ✅ Construct payload correctly
    const updatePayload = {
      type: "reference",
      relation: "http://www.w3.org/2000/01/rdf-schema#seeAlso",
      value: "http://lexica/mylexicon#" + newSense,  // Use properly escaped definition
      currentValue: ""
    };

     console.log("🚀 Sending payload:", JSON.stringify(updatePayload));  // Debugging

    return this.http.post(`${this.ADD_GR_URL}?id=${encodeURIComponent(senseId)}`, updatePayload, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'text'  // ✅ Expect plain text response instead of JSON
    }).pipe(
      map(response => {
        //  console.log("✅ Server Response:", response);
        return { success: true, message: response }; // Wrap text response in an object
      })
    );
  }

  deleteGenericRelation(senseId: string, Sense: string): Observable<any> {
    if (!senseId) {
      console.error("Error: senseId is missing!");
      throw new Error("Missing senseId parameter!");
    }
    Sense = Sense.trim().replace(/['"\\]+/g, '');
    // ✅ Construct payload correctly
    const updatePayload = {
      relation: "http://www.w3.org/2000/01/rdf-schema#seeAlso",
      value: "http://lexica/mylexicon#" + Sense
    };

    console.log("🚀 Sending payload:", JSON.stringify(updatePayload));  // Debugging

    return this.http.post(`${this.DELETE_GR_URL}?id=${encodeURIComponent(senseId)}`, updatePayload, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'text'  // ✅ Expect plain text response instead of JSON
    }).pipe(
      map(response => {
        //  console.log("✅ Server Response:", response);
        return { success: true, message: response }; // Wrap text response in an object
      })
    );
  }
}
