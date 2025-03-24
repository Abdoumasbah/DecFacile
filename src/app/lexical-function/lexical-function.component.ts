import {ChangeDetectorRef, Component, computed, inject, OnInit} from '@angular/core';
import {LexicalFunctionService} from '../services/lexical-function.service';
import {toSignal} from '@angular/core/rxjs-interop';
import {SensesService} from '../services/senses.service';
import {SelectedSenseService} from '../services/selected-sense.service';
import {SenseDetailService} from '../services/sense-detail.service';

@Component({
  selector: 'app-lexical-function',
  templateUrl: './lexical-function.component.html',
  standalone: false,
  styleUrl: './lexical-function.component.scss'
})
export class LexicalFunctionComponent implements OnInit {

  constructor(private cdr: ChangeDetectorRef) {
  }

  private lexicalFunctionService = inject(LexicalFunctionService);
  private sensesService = inject(SensesService);
  private senseDetailService = inject(SenseDetailService);

  selectedLexicalFunction: string | null = null;
  selectedSenseTarget: string | null = null;
  selectedId: string | null = null;
  allSenses: string[] = [];
  // ✅ Updated: Track multiple lexical function pairs
  additionalPairs: {
    lexicalFunction: string | null,
    sense: string | null,
    type: string | null
  }[] = [];

  LF_ALL = toSignal(this.lexicalFunctionService.getAll());  // 🔹 Charger toutes les LF disponibles
  LF_SELECTED = toSignal(this.lexicalFunctionService.selectedLexicalFunction$);
  SS_SELECTED = toSignal(this.lexicalFunctionService.selectedSenseTarget$);
  SS_ALL = toSignal(this.sensesService.getAll()); // 🔹 Charger toutes les senses disponibles

  private selectedSenseService = inject(SelectedSenseService);

  getLexFunct = computed(() => {
    const selectedLF = this.LF_SELECTED();
    const allLF = this.LF_ALL()?.map(entry => entry.lexicalFunction) || [];

    return selectedLF ? [selectedLF, ...allLF] : allLF;  // 🔹 Ajout de la LF sélectionnée
  });

  getSenses = computed(() => {
    const selectedSense = this.SS_SELECTED();
    this.allSenses = this.SS_ALL()?.list.map(entry => entry.sense) || [];

    return selectedSense ? [selectedSense, ...this.allSenses] : this.allSenses;
  });

  ngOnInit() {
    this.lexicalFunctionService.selectedLexicalFunction$.subscribe((lf) => {
      this.selectedLexicalFunction = lf;
    });


    this.lexicalFunctionService.selectedSenseTarget$.subscribe((sense) => {
      this.selectedSenseTarget = sense;
    });

    this.selectedSenseService.selectedSenseID$.subscribe((id) => {
      this.selectedId = id;
    });

    // ✅ Ensure `additionalPairs` updates correctly
    this.subscribeToAdditionalPairs();
  }

  subscribeToAdditionalPairs() {
    this.lexicalFunctionService.additionalPairs$.subscribe((pairs) => {
      this.additionalPairs = pairs.map(pair => ({
        lexicalFunction: pair.lexicalFunction,
        sense: pair.sense,
        type: null // ✅ Default value, will be updated when retrieving the LF type
      }));
    });
  }

  onSenseChange(event: Event) {
    const newSense = (event.target as HTMLSelectElement).value;
    this.lexicalFunctionService.setSelectedSenseTarget(newSense);
  }

  onLFChange(event: Event) {
    const newLF = (event.target as HTMLSelectElement).value;

    // 🔹 Find the corresponding LF object in the list
    const selectedLFObject = this.LF_ALL()?.find(entry => entry.lexicalFunction === newLF);

    if (selectedLFObject) {
      this.selectedLexicalFunction = selectedLFObject.lexicalFunction; // Store the lexical function URL
    }
  }
  onLFChangeForPair(event: Event, pair: { lexicalFunction: string | null, sense: string | null, type: string | null }) {
    pair.lexicalFunction = (event.target as HTMLSelectElement).value;
  }

  onSenseChangeForPair(event: Event, pair: { lexicalFunction: string | null, sense: string | null, type: string | null }) {
    pair.sense = (event.target as HTMLSelectElement).value;
  }


  addNewPair() {
    this.additionalPairs.push({ lexicalFunction: null, sense: null, type: null });
  }

  removePair(index: number) {
    const pairToRemove = this.additionalPairs[index];

    if (pairToRemove.lexicalFunction && pairToRemove.sense) {
      // ✅ Ensure selectedId is used correctly for this pair
      this.senseDetailService.getLFById(this.selectedId!).subscribe(existingPairs => {
        const existingPair = existingPairs.find(p =>
          p.lexicalFunction === pairToRemove.lexicalFunction &&
          p.senseTarget === pairToRemove.sense
        );

        if (existingPair && existingPair.id) {  // ✅ Ensure the ID exists
          const deleteId = existingPair.id;  // ✅ Use the actual ID

          this.lexicalFunctionService.deleteLexicalFunction(deleteId).subscribe({
            next: () => {
              // ✅ Remove from UI only after successful deletion
              this.additionalPairs.splice(index, 1);
            },
            error: (err) => {
              console.error("❌ Error deleting lexical function:", err);
            }
          });
        } else {
          console.warn("⚠️ Pair not found in backend. Removing from UI only.");
          this.additionalPairs.splice(index, 1);
          this.lexicalFunctionService.clearSelection();
        }
      });
    } else {
      // ✅ If the pair is an empty row, just remove from UI
      this.additionalPairs.splice(index, 1);
      this.lexicalFunctionService.clearSelection();
    }
  }

  createLFAndSense(pair?: { lexicalFunction: string | null, sense: string | null, type: string | null }) {
    let lexicalFunction: string | null;
    let senseTarget: string | null;

    if (pair) {
      lexicalFunction = pair.lexicalFunction;
      senseTarget = pair.sense;
    } else {
      lexicalFunction = this.selectedLexicalFunction;
      senseTarget = this.selectedSenseTarget;
    }

    if (!this.selectedId) {
      console.error("❌ Error: Missing Sense ID! Cannot proceed.");
      return;
    }

    const selectedSenseId = this.selectedId as string; // Ensure `selectedId` is a string

    if (!lexicalFunction || !senseTarget) {
      console.error("❌ Error: Missing values! Cannot proceed.");
      return;
    }

    // ✅ Retrieve the type of the selected LF
    const selectedLFObject = this.LF_ALL()?.find(entry => entry.lexicalFunction === lexicalFunction);
    const selectedType = selectedLFObject ? selectedLFObject.type : "defaultType";

    this.senseDetailService.getLFById(selectedSenseId).subscribe(existingPairs => {
      const existsInBackend = existingPairs.some(existingPair =>
        existingPair.lexicalFunction === lexicalFunction &&
        existingPair.senseTarget === senseTarget
      );

      if (existsInBackend) {
        console.warn("⚠️ This LF-Sense pair already exists in the backend! Skipping duplicate.");
        return;
      }

      console.log("✅ Proceeding with API call to create new LF-Sense pair...");

      this.lexicalFunctionService.createLexicalFunction(
        selectedSenseId,
        senseTarget,
        lexicalFunction,
        selectedType
      ).subscribe({
        next: (response) => {
          this.lexicalFunctionService.addAdditionalPair(lexicalFunction!, senseTarget!);

          if (pair) {
            // ✅ Update existing additionalPair entry
            pair.lexicalFunction = null;
            pair.sense = null;
            pair.type = null;
          } else {

            // ✅ Add an empty row immediately after adding a new pair
            this.additionalPairs.push({ lexicalFunction: null, sense: null, type: null });
          }

          this.cdr.detectChanges();
          this.cdr.markForCheck();

          // ✅ Reset selections for the main input field to prevent duplication
          this.selectedLexicalFunction = null;
          this.selectedSenseTarget = null;
        },
        error: (err) => {
          console.error("❌ Error adding lexical function:", err);
        }
      });
    });
  }


  deleteLFAndSense() {
    if (!this.selectedId) {
      this.selectedLexicalFunction = null;
      this.selectedSenseTarget = null;
      return;
    }

    this.lexicalFunctionService.deleteLexicalFunction(this.selectedId).subscribe({
      next: () => {
        this.selectedLexicalFunction = null;
        this.selectedSenseTarget = null;
        this.selectedId = null;
        this.lexicalFunctionService.clearSelection(); // 🔹 Refresh the UI
      },
      error: (err) => {
        console.error("❌ Error deleting lexical function:", err);
      }
    });
  }

}

