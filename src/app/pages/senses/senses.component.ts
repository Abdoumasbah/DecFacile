import {Component, computed, inject, Input, model} from '@angular/core';
import {DictEntryService} from '../../services/dict-entry.service';
import {toSignal} from '@angular/core/rxjs-interop';
import {ECDEntryTreeService} from '../../services/ecdentry-tree.service';
import {IECDEntryTree} from '../../interfaces/ECDEntryTree.interface';

@Component({
  selector: 'app-senses',
  standalone: false,
  templateUrl: './senses.component.html',
  styleUrl: './senses.component.scss'
})

export class SensesComponent {
  selectedEntryId: string | null = null;

  constructor(private ecdEntryTreeService: ECDEntryTreeService) {
  }

  private dictEntryService = inject(DictEntryService);
  ECDS = toSignal(this.dictEntryService.getAll());
  detailedEntry: IECDEntryTree[] | null = null;

  @Input() selectedLanguage: string = "";

  search = model("");
  getECDEntries = computed(() => {
    let entries = this.ECDS()?.list || [];

    // 🔹 Filtrer par langue si une langue est sélectionnée
    if (this.selectedLanguage) {
      entries = entries.filter(entry => entry.language === this.selectedLanguage);
    }


    // 🔹 Ensuite, filtrer par label
    if (this.search()) {
      entries = entries.filter(entry => entry.label.includes(this.search()));
    }

    return entries;
  });

  loadDictEntry(id: string) {
    if (this.selectedEntryId === id) {
      // Désélectionner si on clique sur le même élément
      this.selectedEntryId = null;
      this.detailedEntry = null;
      return;
    }

    this.selectedEntryId = id;
    this.ecdEntryTreeService.getByIdSense(id).subscribe((result) => {
      if (result && result.length > 0) {
        this.detailedEntry = this.flattenSenses(result); // On récupère toutes les senses
      } else {
        this.detailedEntry = null;
      }
    });
  }

  /**
   * Fonction pour récupérer toutes les senses y compris celles de haut niveau (II, III)
   */

  private flattenSenses(entries: IECDEntryTree[]): IECDEntryTree[] {
    let senses: IECDEntryTree[] = [];

    for (let entry of entries) {
      if (entry.referredEntity) {
        senses.push(entry);
      }

      if (entry.children && entry.children.length > 0) {
        senses = senses.concat(this.flattenSenses(entry.children));
      }
    }

    return senses;
  }


}
