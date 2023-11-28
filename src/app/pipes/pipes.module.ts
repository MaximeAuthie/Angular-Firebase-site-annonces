import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirstCharUppercasePipe } from './first-char-uppercase.pipe';



@NgModule({
  declarations: [
    FirstCharUppercasePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FirstCharUppercasePipe
  ]
})
export class PipesModule { }
