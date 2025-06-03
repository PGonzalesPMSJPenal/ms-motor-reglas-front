import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'constructor-reglas',
    loadChildren: () => import('./constructor-reglas/constructor-reglas.module')
      .then(m => m.ConstructorReglasModule)
  },
  { path: '', redirectTo: '/constructor-reglas', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
