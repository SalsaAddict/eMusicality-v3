import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BreakdownComponent } from './breakdown/breakdown.component';

const routes: Routes = [
  //{ path: 'home', component: HomeComponent },
  { path: 'breakdown/:songId', component: BreakdownComponent },
  { path: '', redirectTo: '/breakdown/esoesamor', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
