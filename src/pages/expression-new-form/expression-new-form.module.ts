import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExpressionNewFormPage } from './expression-new-form';

@NgModule({
  declarations: [
    ExpressionNewFormPage,
  ],
  imports: [
    IonicPageModule.forChild(ExpressionNewFormPage),
  ],
})
export class ExpressionNewFormPageModule {}
