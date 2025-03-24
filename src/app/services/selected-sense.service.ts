import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SelectedSenseService {
  private selectedSenseSubject = new BehaviorSubject<string | null>(null);
  private selectedSenseSubjectID = new BehaviorSubject<string | null>(null);
  selectedSense$ = this.selectedSenseSubject.asObservable();
  selectedSenseID$ = this.selectedSenseSubjectID.asObservable();

  setSelectedSense(sense: string) {
    this.selectedSenseSubject.next(sense);
  }

  setSelectedSenseID(sense: string) {
    this.selectedSenseSubjectID.next(sense);
  }
}
