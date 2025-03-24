import {ChangeDetectorRef, Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {DictEntry} from '../models/DictEntry.model';
import {IECDEntryTree} from '../interfaces/ECDEntryTree.interface';
import {SelectedSenseService} from '../services/selected-sense.service';
import {ECDEntryTreeService} from '../services/ecdentry-tree.service';
import {IForms} from '../interfaces/forms.interface';
import {SharedFunctionModel} from '../models/SharedFunction.model';
import {SenseDetailService} from '../services/sense-detail.service';
import {LexicalFunctionService} from '../services/lexical-function.service';

@Component({
  selector: 'app-dict-entry',
  templateUrl: './dict-entry.component.html',
  standalone: false,
  styleUrl: './dict-entry.component.scss'
})
export class DictEntryComponent {

  @Input() dictEntry: DictEntry = new DictEntry();
  @Input() isSelected: boolean = false;
  @Input() detailedEntry: IECDEntryTree[] | null = null;
  @Output() entrySelected = new EventEmitter<string>();

  private senseDetailService = inject(SenseDetailService);
  private lexicalFunctionService = inject(LexicalFunctionService);
  private selectedSenseService = inject(SelectedSenseService);

  protected sharedFunctionModel: SharedFunctionModel = new SharedFunctionModel();

  forms: IForms[] = [];

  constructor(private ecdEntryTreeService: ECDEntryTreeService, private cdr: ChangeDetectorRef) {}


  loadDetails() {
    this.entrySelected.emit(this.dictEntry.dictionaryEntry);
    this.selectedSenseService.setSelectedSense('');
    this.lexicalFunctionService.clearAdditionalPairs();
    this.loadForms();
  }

  get entries(): IECDEntryTree[] | null {
    return this.detailedEntry;
  }
  setSelectedSense(sense: IECDEntryTree) {

    this.selectedSenseService.setSelectedSenseID(sense.referredEntity);

    // **Clear previous definition** (triggers reloading)
    this.selectedSenseService.setSelectedSense('');

    this.lexicalFunctionService.clearAdditionalPairs(); // 🔹 Reset additionalPairs for the new sense

    this.senseDetailService.getSenseDetail(sense.referredEntity).subscribe((senseDetail) => {
      const definitionObj = senseDetail.definition.find(def => def.propertyID === 'definition');

      if (definitionObj) {
        // ✅ Set the updated definition
        this.selectedSenseService.setSelectedSense(definitionObj.propertyValue);
      }

      // ✅ Ensure UI updates immediately
      this.cdr.detectChanges();
    });

    this.senseDetailService.getLFById(sense.referredEntity).subscribe((lfDataArray) => {
      lfDataArray.forEach(lfData => {
        this.lexicalFunctionService.addAdditionalPair(lfData.lexicalFunction, lfData.senseTarget);
      });
    });
  }

  loadForms() {
    this.ecdEntryTreeService.getByIdForms(this.dictEntry.dictionaryEntry).subscribe((result) => {
      this.forms = result;
    });
  }

}

