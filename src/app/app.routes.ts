import { Routes } from '@angular/router';
import {SensesComponent} from './pages/senses/senses.component';
import {NotFoundComponent} from './pages/not-found/not-found.component';

export const routes: Routes = [{
  path: '',
  redirectTo: 'home',
  pathMatch: 'full'
},
  {
  path: 'home',
  component : SensesComponent
},{
  path: '**',
  component : NotFoundComponent
}];
