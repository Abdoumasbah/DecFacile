import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import {SearchComponent} from './search/search.component';
import {DictEntryComponent} from './dict-entry/dict-entry.component';
import {SensesComponent} from './pages/senses/senses.component';
import {HeaderComponent} from './header/header.component';
import {ExempleComponent} from './exemple/exemple.component';
import {LexGovComponent} from './lex-gov/lex-gov.component';
import {LexicalFunctionComponent} from './lexical-function/lexical-function.component';
import {RouterOutlet} from '@angular/router';
import {AppRoutingModule} from './app-routing.module';
import {HttpClientModule} from '@angular/common/http';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    SensesComponent,
    DictEntryComponent,
    HeaderComponent,
    ExempleComponent,
    SearchComponent,
    LexGovComponent,
    LexicalFunctionComponent,
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    AppRoutingModule,
    RouterOutlet
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
