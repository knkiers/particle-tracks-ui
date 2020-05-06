import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const appRoutes: Routes = [
  //{ path: 'crisis-center', component: CrisisListComponent },
  // { path: 'heroes',     component: HeroListComponent }, // <-- delete this line
  { path: '',   redirectTo: '/login', pathMatch: 'full' },
  //{ path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
