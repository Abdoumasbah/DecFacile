import {ChangeDetectorRef, Component, computed, ElementRef, inject, ViewChild} from '@angular/core';
import {SelectedSenseService} from '../services/selected-sense.service';
import {SensesService} from '../services/senses.service';
import {SharedFunctionModel} from '../models/SharedFunction.model';
import {toSignal} from '@angular/core/rxjs-interop';
import {SenseDetailService} from '../services/sense-detail.service';
import {SenseDetail} from '../models/SenseDetail.model';

@Component({
  selector: 'app-exemple',
  templateUrl: './exemple.component.html',
  standalone: false,
  styleUrl: './exemple.component.scss'
})
export class ExempleComponent {

  selectedDefinition: string = '';
  selectedExample: string = '';
  isModalOpen: boolean = false;
  isDefinitionModalOpen: boolean = false;
  isEditing: boolean = false;
  updatedDefinition: string = '';
  oldDefinition: string = '';

  selectedDescription: string = '';
  selectedSenseTag: string = '';
  cursorPosition: number = 0;
  selectedSenseId: string = '';
  oldSenses: string[] = []; // Store old senses before editing

  insertedSenses: { tag: string, definition: string }[] = [];

  @ViewChild('descriptionField', {static: false}) descriptionField!: ElementRef;

  constructor(private selectedSenseService: SelectedSenseService, private cdr: ChangeDetectorRef) {
  }

  private senseDetailService = inject(SenseDetailService);
  private sensesService = inject(SensesService);
  protected sharedFunctionModel: SharedFunctionModel = new SharedFunctionModel();
  SS = toSignal(this.sensesService.getAll());

  getSenses = computed(() => {
    return (this.SS()?.list.map(entry => entry));
  });

  ngOnInit() {
    this.selectedSenseService.selectedSense$.subscribe((definition) => {
      if (definition !== null) {
        this.selectedDefinition = definition;
        this.oldDefinition = this.selectedDefinition;
        this.descriptionField.nativeElement.innerHTML = this.selectedDefinition;


        this.addLinkEventListeners();
      }
    });
    this.selectedSenseService.selectedSenseID$.subscribe((id) => {
      if (id !== null) {
        this.selectedSenseId = id;
      }
    });
  }

  enableEditing() {
    this.isEditing = true;
    this.updatedDefinition = this.selectedDefinition;
    this.oldDefinition = this.selectedDefinition;

    // ✅ Extract old senses before editing
    this.oldSenses = this.extractSensesFromDefinition(this.selectedDefinition);

    setTimeout(() => {
      this.restoreCursorPosition();
    }, 0);
  }

  updateDescription(event: Event) {
    const inputEvent = event as InputEvent;
    const target = inputEvent.target as HTMLElement;

    if (!target) return;

    this.updateCursorPosition();

    // ✅ Detect if a sense link is being deleted and remove the full word
    this.handleSenseDeletion(target, inputEvent);

    this.selectedDefinition = target.innerHTML; // Update definition after handling deletion
    this.addLinkEventListeners(); // Reattach event listeners for remaining links

    setTimeout(() => {
      this.restoreCursorPosition();
    }, 0);
  }

  handleSenseDeletion(target: HTMLElement, event: InputEvent) {
    if (event.inputType === "deleteContentBackward" || event.inputType === "deleteContentForward") {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const node = range.startContainer;

        // 🔹 Find the closest <a> element
        const link = node.parentElement?.closest("a");

        if (link) {
          const senseTag = link.getAttribute("data-url");

          const nextSibling = link.nextSibling; // ✅ Store where to place the cursor after deletion

          link.remove(); // ✅ Remove the whole <a> tag

          if (senseTag) {
            this.removeSenseFromInsertedList(senseTag);
          }

          // ✅ Restore cursor to correct position
          setTimeout(() => {
            const newRange = document.createRange();
            const newSelection = window.getSelection();

            if (nextSibling) {
              newRange.setStart(nextSibling, 0);
            } else {
              newRange.setStart(this.descriptionField.nativeElement, this.descriptionField.nativeElement.childNodes.length);
            }

            newRange.collapse(true);
            newSelection?.removeAllRanges();
            newSelection?.addRange(newRange);
          }, 0);
        }
      }
    }
  }

  removeSenseFromInsertedList(senseTag: string) {
    this.insertedSenses = this.insertedSenses.filter((sense) => sense.tag !== senseTag);
  }

  addLinkEventListeners() {
    const links = this.descriptionField.nativeElement.querySelectorAll('.clickable-link');
    links.forEach((link: HTMLElement) => {
      link.addEventListener('click', (event) => {
        event.preventDefault(); // ❌ Prevents navigation!
        const senseId = link.getAttribute('data-url');
        if (senseId) {
          this.fetchSenseDetail(senseId); // ✅ Opens modal with definition
        }
      });
    });
  }

  fetchSenseDetail(senseId: string) {
    this.senseDetailService.getSenseDetail(senseId).subscribe({
      next: (senseDetail: SenseDetail) => {
        const definitionObj = senseDetail.definition.find(def => def.propertyID === 'definition');
        const exampleObj = senseDetail.definition.find(def => def.propertyID === 'senseExample');

        this.selectedDefinition = definitionObj ? definitionObj.propertyValue : 'No definition available.';
        this.selectedExample = exampleObj ? exampleObj.propertyValue : 'No example available.';

        this.openDefinitionModal(); // ✅ Open the modal
      },
      error: (err) => {
        console.error('Error fetching sense detail:', err);
        this.selectedDefinition = 'Error fetching sense detail.';
        this.selectedExample = '';
        this.openDefinitionModal();
      }
    });
  }

  extractSensesFromDefinition(definition: string): string[] {
    console.log("📌 Extracting senses from definition:", definition);
    const parser = new DOMParser();
    const doc = parser.parseFromString(definition, "text/html");
    const links = doc.querySelectorAll("a");

    console.log(`🔍 Found ${links.length} <a> elements`);

    // Extract href instead of data-url
    const senses = Array.from(links)
      .map(link => link.getAttribute("href")) // ✅ Get `href`
      .filter((href): href is string => href !== null) // ✅ Ensure it's not null
      .map(href => href.replace("http://lexica/mylexicon#", "")); // ✅ Extract only the sense ID

    console.log("✅ Extracted senses:", senses);
    return senses;
  }


  saveEditedDefinition() {
    let newDefinition = this.descriptionField.nativeElement.innerText.trim(); // ✅ Ensure innerText is used

    if (!newDefinition) {
      alert("Definition cannot be empty!");
      return;
    }
    if (!this.selectedSenseId) {
      console.error("Error: selectedSenseId is missing!");
      return;
    }

    // ✅ Convert raw sense references to <a> links
    newDefinition = this.convertSensesToLinks(newDefinition);

    this.senseDetailService.updateSenseDefinition(this.selectedSenseId, newDefinition, this.oldDefinition)
      .subscribe({
        next: () => {

          this.selectedDefinition = newDefinition;
          this.oldDefinition = newDefinition;

          this.cdr.detectChanges();
          this.cdr.markForCheck();

          setTimeout(() => {
            this.isEditing = false;
            this.descriptionField.nativeElement.innerHTML = this.selectedDefinition;
            this.restoreCursorPosition();
          }, 0);

          // ✅ Extract the new senses from the updated definition
          this.updateGenericRelations(newDefinition);
        },
        error: (err) => {
          console.error('❌ Error updating definition:', err);
        }
      });
  }

  updateGenericRelations(newDefinition: string) {
    const newSenses = this.extractSensesFromDefinition(newDefinition);
    console.log("✅ Extracted New Senses:", newSenses);

    // ✅ Compare old vs new senses
    const sensesToRemove = this.oldSenses.filter(sense => !newSenses.includes(sense));
    const sensesToAdd = newSenses.filter(sense => !this.oldSenses.includes(sense));

    console.log("❌ Senses to Remove:", sensesToRemove);
    console.log("✅ Senses to Add:", sensesToAdd);

    // ✅ Remove old relations (DELETE requests)
    sensesToRemove.forEach(sense => {
      this.senseDetailService.deleteGenericRelation(this.selectedSenseId, sense)
        .subscribe({
          next: () => console.log(`❌ Deleted relation for: ${sense}`),
          error: (err) => console.error('❌ Error deleting relation:', err)
        });
    });

    // ✅ Add new relations (ADD requests)
    sensesToAdd.forEach(sense => {
      this.senseDetailService.addGenericRelation(this.selectedSenseId, sense)
        .subscribe({
          next: () => console.log(`✅ Added relation for: ${sense}`),
          error: (err) => console.error('❌ Error adding relation:', err)
        });
    });

    // ✅ Update `oldSenses` to match the new state
    this.oldSenses = [...newSenses];
  }



  convertSensesToLinks(text: string): string {
    return text.replace(/(\b[a-zA-Z0-9_-]+_sense\d+\b)/g, (match) => {
      // Ensure proper escaping and correct href format
      return `<a href=\\"http://lexica/mylexicon#${encodeURIComponent(match)}\\">${match}</a>`;
    });
  }


  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  onSenseSelect(event: Event) {
    const selectedSense = (event.target as HTMLSelectElement).value;
    const foundSense = this.getSenses()?.find(sense => sense.sense === selectedSense);

    if (foundSense) {
      this.selectedDescription = foundSense.definition;
      this.selectedSenseTag = `${this.sharedFunctionModel.extractLabelFromURI(foundSense.sense)}`;
    } else {
      this.selectedDescription = 'No description available';
      this.selectedSenseTag = '';
    }
  }

  addSenseToDescription() {
    if (this.selectedSenseTag && this.descriptionField) {
      const descriptionElement = this.descriptionField.nativeElement;

      // ✅ Prevent duplicate links
      const isAlreadyInserted = this.insertedSenses.some(sense => sense.tag === this.selectedSenseTag);
      if (!isAlreadyInserted) {
        this.insertedSenses.push({tag: this.selectedSenseTag, definition: this.selectedDescription});
      }

      // 🔹 Create the clickable link
      const anchor = document.createElement("a");
      anchor.href = `http://lexica/mylexicon#${this.selectedSenseTag}`;  // ✅ Correct URL
      //anchor.textContent = this.sharedFunctionModel.extractLabelFromURI(this.selectedSenseTag); // ✅ Use textContent (not innerHTML)
      anchor.textContent = this.selectedSenseTag
      anchor.setAttribute("data-url", `http://lexica/mylexicon#${this.selectedSenseTag}`); // ✅ Ensure correct data-url

      // ✅ Event Listener: Clicking the link should fetch details
      anchor.addEventListener("click", (event) => {
        event.preventDefault();
        this.fetchSenseDetail(this.selectedSenseTag);
      });

      // 🔹 Insert the link at the cursor position
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(anchor);

        // ✅ Move cursor after the inserted link
        range.setStartAfter(anchor);
        range.setEndAfter(anchor);
        selection.removeAllRanges();
        selection.addRange(range);
      }

      // ✅ Update definition with new link
      this.selectedDefinition = descriptionElement.innerHTML;

      this.closeModal();
    }
  }

  openDefinitionModal() {
    this.isDefinitionModalOpen = true;
  }

  closeDefinitionModal() {
    this.isDefinitionModalOpen = false;
  }

  updateCursorPosition() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const preSelectionRange = range.cloneRange();
    preSelectionRange.selectNodeContents(this.descriptionField.nativeElement);
    preSelectionRange.setEnd(range.startContainer, range.startOffset);

    this.cursorPosition = preSelectionRange.toString().length;
  }

  restoreCursorPosition() {
    const node = this.descriptionField.nativeElement;
    const selection = window.getSelection();
    const range = document.createRange();

    let charIndex = 0;
    let nodeStack = [node];
    let startNode: Node | null = null;
    let startOffset = 0;

    while (nodeStack.length > 0) {
      let currentNode = nodeStack.pop()!;

      if (currentNode.nodeType === Node.TEXT_NODE) {
        let nextCharIndex = charIndex + currentNode.nodeValue!.length;
        if (this.cursorPosition >= charIndex && this.cursorPosition <= nextCharIndex) {
          startNode = currentNode;
          startOffset = this.cursorPosition - charIndex;
          break;
        }
        charIndex = nextCharIndex;
      } else {
        for (let i = currentNode.childNodes.length - 1; i >= 0; i--) {
          nodeStack.push(currentNode.childNodes[i]);
        }
      }
    }

    if (startNode) {
      range.setStart(startNode, startOffset);
      range.collapse(true);
      selection!.removeAllRanges();
      selection!.addRange(range);
    }
  }

}
