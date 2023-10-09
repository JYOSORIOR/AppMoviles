import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetallesPage } from './detalles.page';

const routes: Routes = [
  {
    path: '', // La ruta acepta un parámetro de ID
    component: DetallesPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetallesPageRoutingModule {}
