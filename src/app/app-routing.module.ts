import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SensesComponent} from './pages/senses/senses.component';
import {NotFoundComponent} from './pages/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: SensesComponent
  }, {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
