import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// https://github.com/Robinyo/serendipity/blob/10b8fe1e516590d40723d5151308320b8f24fd63/projects/utils/src/lib/angular-material/angular-material.module.ts

//
// Navigation
//

import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

import { MatButtonModule } from '@angular/material/button';
//import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';


import { MatCardModule } from '@angular/material/card';

// Forms
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

const modules: any[] = [
  MatMenuModule,
  MatSidenavModule,
  MatToolbarModule,
  MatButtonModule,
  MatIconModule,
  MatListModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule
]


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ...modules
  ],
  exports: [...modules]
})
export class AngularMaterialModule { }
