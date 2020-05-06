import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { NavComponent } from './components/nav/nav.component';
import { LayoutModule } from '@angular/cdk/layout';
//import { MatToolbarModule } from '@angular/material/toolbar';
//import { MatButtonModule } from '@angular/material/button';
//import { MatSidenavModule } from '@angular/material/sidenav';
//import { MatIconModule } from '@angular/material/icon';
//import { MatListModule } from '@angular/material/list';

import { AngularMaterialModule } from '../shared/angular-material/angular-material.module';

@NgModule({
  declarations: [NavigationBarComponent, NavComponent],
  imports: [
    CommonModule,
    LayoutModule,
    //MatToolbarModule,
    //MatButtonModule,
    //MatSidenavModule,
    //MatIconModule,
    //MatListModule,
    AngularMaterialModule,
    RouterModule
  ],
  exports: [NavigationBarComponent, NavComponent, AngularMaterialModule]
})
export class CoreModule { }
