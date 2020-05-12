import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoundRealPipe } from './pipes/round-real.pipe';


@NgModule({
  declarations: [RoundRealPipe],
  imports: [
    CommonModule
  ],
  exports: [CommonModule, RoundRealPipe]
})
export class SharedModule { }
