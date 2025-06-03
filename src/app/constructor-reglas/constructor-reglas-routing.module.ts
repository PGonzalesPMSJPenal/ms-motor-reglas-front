import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConstructorReglasComponent } from './constructor-reglas.component';

const routes: Routes = [{ path: '', component: ConstructorReglasComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConstructorReglasRoutingModule { }
